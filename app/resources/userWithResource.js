import PlayerResource from "./playerResource.js";

export default class UserWithResource {
    constructor(user, player) {
        this.id = user._id;
        this.name = user.name;
        this.playerData = player == null ? null : new PlayerResource(player);
        this.username = user.username;
        this.email = user.email;
        this.createdAt = user.createdAt.toDateString();
        this.updatedAt = user.updatedAt.toDateString();
    }
}
