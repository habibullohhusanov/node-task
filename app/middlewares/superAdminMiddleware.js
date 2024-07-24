import { serverError, unauthorized } from "../../uitls/response.js";

const superAdminMiddleware = async (req, res, next) => {
    try {
        const role = req.user.role;

        if (role == "superAdmin") {
            return next();
        }

        return unauthorized(res);
    } catch (error) {
        return serverError(res, error.message);
    }
}
export default superAdminMiddleware;