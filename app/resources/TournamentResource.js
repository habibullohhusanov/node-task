import PlayerResource from "./playerResource.js"
import UserResource from "./userResource.js"

export default class TournamentResource {
    constructor(tournament) {
        this.id = tournament._id,
        this.name = tournament.name,
        this.owner = new UserResource(tournament.owner),
        this.status = tournament.status,
        this.participants = tournament.participants.map(tournament => new PlayerResource(tournament)),
        this.startAt = tournament.startAt,
        this.finishAt = tournament.finishAt,
        this.createdAt = tournament.createdAt.toDateString(),
        this.updatedAt = tournament.updatedAt.toDateString()
    }
}