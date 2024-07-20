import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Player from "../models/playerModel.js";
import UserResource from "../resources/userResource.js";
import { created, notFound, requestError, serverError, succes, unauthorized } from "../../uitls/response.js";
import { userDestroyRequest, userPlayerData, userUpdateDataRequest, userUpdatePasswordRequest } from "../requests/authRequest.js";
import PlayerResource from "../resources/playerResource.js";

// Update user account data
export const updateData = async (req, res) => {
    try {
        const updateData = req.body;
        const { error } = userUpdateDataRequest.validate(updateData);
        if (error) {
            return requestError(error, error.message);
        }

        const checkUsername = await User.findOne({ username: updateData.username });
        if (checkUsername) {
            return requestError(res, "This username is already in use");
        }

        const user = await User.findByIdAndUpdate(req.user._id, {
            name: updateData.name,
            username: updateData.username,
            email: updateData.email,
        }, { new: true });
        const data = new UserResource(user);
        return succes(res, data, "User updated");
    } catch (error) {
        return serverError(res, error.message);
    }
}
// Update user account password
export const updatePassword = async (req, res) => {
    try {
        const updatePassword = req.body;
        const { error } = userUpdatePasswordRequest.validate(updatePassword);
        if (error) {
            return requestError(res, error.message);
        }
        const isCheck = req.user.checkPassword(updatePassword.old_password);
        if (!isCheck) {
            return unauthorized(res, "Password incorrect");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updatePassword.password, salt);
        const user = await User.findByIdAndUpdate(req.user._id, {
            password: hashedPassword,
        }, { new: true });
        const data = new UserResource(user);
        return succes(res, data, "User password updated");

    } catch (error) {
        return serverError(res, error.message);
    }
}
// Delete account but admins never can
export const destroy = async (req, res) => {
    try {
        const passwords = req.body;
        const { error } = userDestroyRequest.validate(passwords);
        if (error) {
            return requestError(res, error.message);
        }
        if (req.user.role == "admin" || req.user.role == "superAdmin") {
            return unauthorized(res, "Only the main admin can delete");
        }
        const isCheck = req.user.checkPassword(passwords.password);
        if (!isCheck) {
            return unauthorized(res, "Password incorrect");
        }
        await User.findByIdAndDelete(req.user._id);
        await Player.findByIdAndDelete(req.user._id);
        return succes(res, [], "User deleted");
    } catch (error) {
        return serverError(res, error.message);
    }
}
// Add player date but never admins become players
export const store = async (req, res) => {
    try {
        const reqData = req.body;
        const userId = req.user._id;
        if (req.user.role == "admin" || req.user.role == "superAdmin") {
            return requestError(res, "You can't be player");
        }

        const { error } = userPlayerData.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }
        const checkPlayer = await Player.findOne({ userId });
        if (checkPlayer) {
            return requestError(res, "Already have player data");
        }
        let playerData;
        if (reqData.name) {
            playerData = new Player({
                userId, ...reqData
            });
        } else {
            playerData = new Player({
                name: req.user.name, userId, ...reqData
            });
        }
        const player = await playerData.save();
        const data = new PlayerResource(player);

        return created(res, data, "Added player data");
    } catch (error) {
        return serverError(res, error.message);
    }
}
// Get player date but admins aren't player
export const view = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.role == "admin" || req.user.role == "superAdmin") {
            return requestError(res, "You aren't player");
        }

        const player = await Player.findOne({ userId });
        if (!player) {
            return notFound(res, "You haven't entered any information yet");
        }
        const data = new PlayerResource(player);

        return succes(res, data, "Player data");
    } catch (error) {
        return serverError(res, error.message);
    }
}
// Update player date but admins aren't player
export const update = async (req, res) => {
    try {
        const reqData = req.body;
        const userId = req.user._id;

        if (req.user.role == "admin" || req.user.role == "superAdmin") {
            return requestError(res, "You aren't player");
        }

        const { error } = userPlayerData.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }
        const checkPlayer = await Player.findOne({ userId });
        if (!checkPlayer) {
            return notFound(res, "You haven't entered any information yet");
        }
        let player;
        if (reqData.name) {
            player = await Player.findByIdAndUpdate(checkPlayer._id, {
                name: reqData.name,
                age: reqData.age,
                country: reqData.country,
            }, { new: true });
        } else {
            player = await Player.findByIdAndUpdate(checkPlayer._id, {
                name: req.user.name,
                age: reqData.age,
                country: reqData.country,
            }, { new: true });
        }
        const data = new PlayerResource(player);

        return succes(res, data, "Updated");
    } catch (error) {
        return serverError(res, error.message);
    }
}