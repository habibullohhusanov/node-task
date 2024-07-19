import { serverError, unauthorized } from "../../uitls/response";

const adminMiddleware = async (req, res, next) => {
    try {
        const role = req.user.role
        if (role !== "superAdmin") {
            return unauthorized(res);
        }
        next();
    } catch (error) {
        return serverError(res, error.message);
    }
}
export default adminMiddleware;