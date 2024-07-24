import UserResource from "./userResource.js"

export default class PlayerWithResource {
    constructor(player) {
        this.id = player._id,
        this.name = player.name,
        this.user = new UserResource(player.userId),
        this.age = player.age,
        this.rating = player.rating,
        this.country = player.country
    }
}