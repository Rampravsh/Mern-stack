import { errorHandler } from "../utils/error.js";

export const isVerified = (req, res, next) => {
  if (!req.user.isAccountVerified && !req.user.isGoogleAuth) {
    return next(errorHandler(401, "Please verify your email first"));
  }
  next();
};
