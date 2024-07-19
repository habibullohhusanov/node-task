import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import UserResource from "../resources/userResource.js";
import { loginRequest, registerRequest } from "../requests/authRequest.js";
import { created, requestError, serverError, succes, unauthorized } from "../../uitls/response.js";

export const login = async (req, res) => {
    try {
        const loginData = req.body;
        const { username, password } = req.body;
        const { error } = loginRequest.validate(loginData);
        if (error) {
            return requestError(res, error.message, true);
        } else {
            const user = await User.findOne({ username });
            if (!user) {
                return unauthorized(res, "Data incorrect", true);
            }
            const isCheck = user.checkPassword(password);
            if (isCheck) {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
                    expiresIn: "2d"
                });
                const data = new UserResource(user);
                return succes(res, data, "Account logged in", token);
            }
            return unauthorized(res, "Data incorrect", true);
        }
    } catch (error) {
        return serverError(res, error.message, false, true);
    }
}
export const register = async (req, res) => {
    try {
        const registerData = req.body;
        const { name, username, email, password } = req.body;
        const { error } = registerRequest.validate(registerData);
        if (error) {
            return requestError(res, error.message, true);
        } else {
            let user = await User.findOne({ username });
            if (user) {
                return requestError(res, `${username} alredy exsist`, true);
            }
            const newUser = new User({
                name, username, email, password
            });
            user = await newUser.save();
            const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
                expiresIn: "2d"
            });
            const data = new UserResource(user);
            return created(res, data, "Created", token);
        }
    } catch (error) {
        return serverError(res, error.message, false, true);
    }
}
export const logout = async (req, res) => {

}
export const user = async (req, res) => {
    try {
        const data = new UserResource(req.user);
        return succes(res, data, "User data");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const verify = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.userVerify();
        const data = new UserResource(user);
        return succes(res, data, "User data");
    } catch (error) {
        return serverError(res, error.message);
    }
}