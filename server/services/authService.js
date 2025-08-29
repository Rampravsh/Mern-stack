import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import { errorHandler } from "../utils/error.js";

export const registerUser = async (username, email, password) => {
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  // Generate and save OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  newUser.verifyOtp = otp;
  newUser.verifyOtpExpires = Date.now() + 3600000; // 1 hour

  await newUser.save();

  // Send OTP to user's email
  await sendEmail(
    newUser.email,
    "Verify Your Email",
    `Your OTP for email verification is: ${otp}`
  );

  return newUser;
};

export const verifyOTP = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw errorHandler(404, "User not found");
  }

  if (user.verifyOtp !== otp) {
    throw errorHandler(400, "Invalid OTP");
  }

  if (user.verifyOtpExpires < Date.now()) {
    throw errorHandler(400, "OTP has expired");
  }

  user.isAccountVerified = true;
  user.verifyOtp = "";
  user.verifyOtpExpires = null;
  await user.save();

  return user;
};

export const resendOTP = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw errorHandler(404, "User not found");
  }

  if (user.isAccountVerified) {
    throw errorHandler(400, "Email is already verified");
  }

  // Generate and save new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.verifyOtp = otp;
  user.verifyOtpExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send new OTP to user's email
  await sendEmail(
    user.email,
    "Verify Your Email",
    `Your new OTP for email verification is: ${otp}`
  );

  return user;
};
