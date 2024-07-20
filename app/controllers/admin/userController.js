import bcrypt from "bcryptjs";
import User from "../../models/userModel.js";
import Player from "../../models/playerModel.js";
import UserResource from "../../resources/userResource.js";
import PlayerResource from "../../resources/playerResource.js";
import UserWithResource from "../../resources/userWithResource.js";
import { created, notFound, requestError, serverError, succes, unauthorized } from "../../../uitls/response.js"
import { userPlayerData, userResetPasswordRequest, userUpdateDataRequest } from "../../requests/authRequest.js";

// Get all user
export const index = async (req, res) => {
    try {
        const users = await User.find({ role: "user" });
        const data = users.map(user => new UserResource(user));
        return succes(res, data, "All users");
    } catch (error) {
        return serverError(res, error.message);
    }
}
// Get one user by id
export const veiw = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id);

        if (!user) {
            return notFound(res, "User not found");
        }
        if (user.role == "admin" || user.role == "superAdmin") {
            return unauthorized(res, "You can't see other admins data");
        }

        const player = await Player.findOne({ userId: id });

        const data = new UserWithResource(user, player);

        return succes(res, data, "One user by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const addPlayerData = async (req, res) => {
    try {
        const reqData = req.body;
        const userId = req.params.id;

        const { error } = userPlayerData.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const user = await User.findById(userId);
        if (!user) {
            return notFound(res, "User not found");
        }
        if (user.role == "admin" || user.role == "superAdmin") {
            return unauthorized(res, "You can't add player data");
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
                name: user.name, userId, ...reqData
            });
        }
        const player = await playerData.save();
        const data = new PlayerResource(player);

        return created(res, data, "Added user player data by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const update = async (req, res) => {
    try {
        const reqData = req.body;
        const userId = req.params.id;

        const { error } = userUpdateDataRequest.validate(reqData);
        if (error) {
            return requestError(error, error.message);
        }

        const checkUser = await User.findById(userId);
        if (!checkUser) {
            return notFound(res, "User not found");
        }
        if (checkUser.role == "admin" || checkUser.role == "superAdmin") {
            return unauthorized(res, "You can't update other admins data");
        }

        const checkUsername = await User.findOne({ username: reqData.username });
        if (checkUsername) {
            return requestError(res, "This username is already in use");
        }

        const user = await User.findByIdAndUpdate(userId, {
            name: reqData.name,
            username: reqData.username,
            email: reqData.email,
        }, { new: true });

        const data = new UserResource(user);

        return succes(res, data, "User data updated by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const newPassword = async (req, res) => {
    try {
        const reqData = req.body;
        const userId = req.params.id;

        const { error } = userResetPasswordRequest.validate(reqData);
        if (error) {
            return requestError(error, error.message);
        }

        const checkUser = await User.findById(userId);
        if (!checkUser) {
            return notFound(res, "User not found");
        }
        if (checkUser.role == "admin" || checkUser.role == "superAdmin") {
            return unauthorized(res, "You can't change other admins password");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(reqData.password, salt);
        const user = await User.findByIdAndUpdate(userId, {
            password: hashedPassword,
        }, { new: true });
        const data = new UserResource(user);
        return succes(res, data, "User password updated");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const updatePlayerData = async (req, res) => {
    try {
        const reqData = req.body;
        const userId = req.params.id;

        const { error } = userPlayerData.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const user = await User.findById(userId);
        if (!user) {
            return notFound(res, "User not found");
        }
        if (user.role == "admin" || user.role == "superAdmin") {
            return unauthorized(res, "You can't add player data");
        }

        const checkPlayer = await Player.findOne({ userId });
        if (!checkPlayer) {
            return notFound(res, "No information has been entered yet");
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
                name: user.name,
                age: reqData.age,
                country: reqData.country,
            }, { new: true });
        }
        const data = new PlayerResource(player);

        return succes(res, data, "Updated user player data by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const destroy = async (req, res) => {
    try {
        const userId = req.params.id;

        const checkUser = await User.findById(userId);
        if (!checkUser) {
            return notFound(res, "User not found");
        }
        if (checkUser.role == "admin" || checkUser.role == "superAdmin") {
            return unauthorized(res, "You can't delete other admins password");
        }

        await User.findByIdAndDelete(userId);

        return succes(res, [], "User deleted by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}