import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw errorHandler(404, "User not found");
  }
  const { password, ...rest } = user._doc;
  return rest;
};

export const updateUser = async (userId, currentUserId, data) => {
    if (userId !== currentUserId) {
        throw errorHandler(401, "You can only update your own account!");
    }
    
    if (data.password) {
        if (data.password.length < 6) {
            throw errorHandler(400, "Password must be at least 6 characters");
        }
        data.password = bcryptjs.hashSync(data.password, 10);
    }

    if (data.username) {
        if (data.username.length < 4 || data.username.length > 20) {
            throw errorHandler(400, "Username must be between 4 and 20 characters");
        }
        if (data.username.includes(" ")) {
            throw errorHandler(400, "Username cannot contain spaces");
        }
        if (data.username !== data.username.toLowerCase()) {
            throw errorHandler(400, "Username must be lowercase");
        }
        if (!data.username.match(/^[a-zA-Z0-9]+$/)) {
            throw errorHandler(400, "Username can only contain letters and numbers");
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                username: data.username,
                email: data.email,
                password: data.password,
                avatar: data.avatar,
            },
        },
        { new: true }
    );

    if (!updatedUser) {
        throw errorHandler(404, "User not found");
    }

    const { password, ...rest } = updatedUser._doc;
    return rest;
};
