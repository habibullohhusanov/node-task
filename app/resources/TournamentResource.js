import PlayerWithResource from "./playerWithResource.js";
import { shortDate } from "../../uitls/date.js";
import UserResource from "./userResource.js";

export default class TournamentResource {
    constructor(tournament) {
        this.id = tournament._id,
        this.name = tournament.name,
        this.owner = new UserResource(tournament.owner),
        this.status = tournament.status,
        this.participants = tournament.participants.map(player => new PlayerWithResource(player)),
        this.startAt = shortDate(tournament.startAt),
        this.finishAt = shortDate(tournament.finishAt),
        this.createdAt = shortDate(tournament.createdAt),
        this.updatedAt = shortDate(tournament.updatedAt)
    }
}