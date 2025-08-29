import { getUser, updateUser } from "../services/userService.js";

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await getUser(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.user.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};
