import PlayerWithResource from "./playerWithResource.js";
import UserResource from "./userResource.js";

export default class TournamentResource {
    constructor(tournament) {
        this.id = tournament._id,
        this.name = tournament.name,
        this.owner = new UserResource(tournament.owner),
        this.status = tournament.status,
        this.participants = tournament.participants.map(player => new PlayerWithResource(player)),
        this.startAt = tournament.startAt.toDateString(),
        this.finishAt = tournament.finishAt.toDateString(),
        this.createdAt = tournament.createdAt.toDateString(),
        this.updatedAt = tournament.updatedAt.toDateString()
    }
}