import { registerUser, verifyOTP, resendOTP } from "../services/authService.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

// Register a new user
export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();

  if (
    !trimmedUsername ||
    !trimmedEmail ||
    !password ||
    trimmedUsername === "" ||
    trimmedEmail === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  if (password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
    });
    if (existingUser) {
      return next(
        errorHandler(400, "User with this email or username already exists")
      );
    }

    await registerUser(trimmedUsername, trimmedEmail, password);

    res
      .status(201)
      .json({
        message:
          "User registered successfully. Please check your email for OTP to verify your account.",
      });
  } catch (error) {
    next(error);
  }
};

// Login an existing user
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password || trimmedEmail === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email: trimmedEmail });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAccountVerified: validUser.isAccountVerified, isGoogleAuth: validUser.isGoogleAuth },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const { password: hashedPassword, ...rest } = validUser._doc;

    await sendEmail(
      validUser.email,
      "Login Notification",
      "You have successfully logged in."
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google OAuth
export const google = async (req, res, next) => {
  const { email, name, photo } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAccountVerified: user.isAccountVerified },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const { password: hashedPassword, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUsername =
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4);

      const newUser = new User({
        username: newUsername,
        email,
        password: hashedPassword,
        profilePicture: photo,
        isGoogleAuth: true,
      });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAccountVerified: newUser.isAccountVerified },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const { password: hashedPassword2, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset Link",
      `<p>Please click the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link will expire in 10 minutes.</p>`
    );

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(errorHandler(400, "Password reset link has expired."));
    }
    next(error);
  }
};

// Verify OTP
export const verifyOTPController = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(errorHandler(400, "Email and OTP are required"));
  }

  try {
    await verifyOTP(email, otp);
    res.status(200).json({success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

// Resend OTP
export const resendOTPController = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }

  try {
    await resendOTP(email);
    res.status(200).json({ message: "New OTP sent to your email" });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Logged out successfully");
};
