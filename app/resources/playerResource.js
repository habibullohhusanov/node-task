export default class PlayerResource {
    constructor(player) {
        this.id = player._id,
        this.name = player.name,
        this.age = player.age,
        this.rating = player.rating,
        this.country = player.country,
        this.createdAt = player.createdAt.toDateString(),
        this.updatedAt = player.updatedAt.toDateString()
    }
}