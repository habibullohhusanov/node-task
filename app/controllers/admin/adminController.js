import User from "../../models/userModel.js";
import UserResource from "../../resources/userResource.js";
import { created, requestError, serverError, succes, unauthorized } from "../../../uitls/response.js"
import { changeRoleUser, registerRequest, userUpdateDataRequest } from "../../requests/authRequest.js";

export const index = async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" });
        const data = admins.map(admin => new UserResource(admin));
        return succes(res, data, "All admins");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const show = async (req, res) => {
    try {
        const id = req.params.id;

        const admin = await User.findById(id);
        if (!admin) {
            return notFound(res, "Admin not found");
        }
        if (admin.role == "user") {
            return unauthorized(res, "This user isn't admin")
        }

        const data = new UserResource(admin);

        return succes(res, data, "One admin by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const store = async (req, res) => {
    try {
        const reqData = req.body;
        const { name, username, email, password } = req.body;

        const { error } = registerRequest.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        let admin = await User.findOne({ username });
        if (admin) {
            return requestError(res, `${username} alredy exsist`);
        }

        const newAdmin = new User({
            name, username, email, password, role: "admin"
        });
        admin = await newAdmin.save();

        const data = new UserResource(admin);

        return created(res, data, "Admin created");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const update = async (req, res) => {
    try {
        const reqData = req.body;
        const adminId = req.params.id;

        const { error } = userUpdateDataRequest.validate(reqData);
        if (error) {
            return requestError(error, error.message);
        }

        const checkUser = await User.findById(adminId);
        if (!checkUser) {
            return notFound(res, "Admin not found");
        }
        if (checkUser.role == "user") {
            return unauthorized(res, "This user isn't admin")
        }

        const checkUsername = await User.findOne({ username: reqData.username });
        if (checkUsername) {
            if (checkUsername._id.toString() !== checkUser._id.toString()) {
                return requestError(res, "This username is already in use");
            }
        }

        const admin = await User.findByIdAndUpdate(adminId, {
            name: reqData.name,
            username: reqData.username,
            email: reqData.email,
        }, { new: true });

        const data = new UserResource(admin);

        return succes(res, data, "Admin data updated by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const destroy = async (req, res) => {
    try {
        const adminId = req.params.id;

        const checkAdmin = await User.findById(adminId);
        if (!checkAdmin) {
            return notFound(res, "Admin not found");
        }
        if (checkAdmin.role == "user") {
            return unauthorized(res, "You can't delete user by this request");
        }

        await User.findByIdAndDelete(adminId);

        return succes(res, [], "Admin deleted by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const changeRole = async (req, res) => {
    try {
        const reqData = req.body;
        const userId = req.params.id;

        const { error } = changeRoleUser.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const checkUser = await User.findById(userId);
        if (!checkUser) {
            return notFound(res, "User not found");
        }

        const user = await User.findByIdAndUpdate(userId, {
            role: reqData.role,
        }, { new: true });

        const data = new UserResource(user);
        console.log(data);
        return succes(res, data, "User's role is changed");
    } catch (error) {
        return serverError(res, error.message);
    }
}