import PlayerResource from "./playerResource";

export default class UserWithResource {
    constructor(user, player) {
        this.id = user._id;
        this.name = user.name;
        this.playerData = new PlayerResource(player);
        this.username = user.username;
        this.email = user.email;
        this.createdAt = user.createdAt.toDateString();
        this.updatedAt = user.updatedAt.toDateString();
    }
}
