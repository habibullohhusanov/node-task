import { shortDate } from "../../uitls/date.js";

class UserResource {
    constructor(user) {
        this.id = user._id;
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this.createdAt = shortDate(user.createdAt),
        this.updatedAt = shortDate(user.updatedAt)
    }
}

export default UserResource;