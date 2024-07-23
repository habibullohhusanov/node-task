import { serverError } from "../../uitls/response.js"

export const index = (req, res) => {
    try {

    } catch (error) {
        return serverError(res, error.messages);
    }
}