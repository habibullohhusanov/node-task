import { serverError, unauthorized } from "../../uitls/response.js";

const adminMiddleware = async (req, res, next) => {
    try {
        const role = req.user.role;

        if (role !== "superAdmin") {
            if (role !== "admin") {
                return unauthorized(res);
            }
        }

        if (role !== "admin") {
            return unauthorized(res);
        }
        next();
    } catch (error) {
        return serverError(res, error.message);
    }
}
export default adminMiddleware;