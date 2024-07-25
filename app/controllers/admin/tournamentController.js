import Player from "../../models/playerModel.js";
import { shortDate } from "../../../uitls/date.js";
import Tournament from "../../models/tournamentModel.js";
import TournamentResource from "../../resources/tournamentResource.js";
import PlayerWithResource from "../../resources/playerWithResource.js";
import { togglePlayer, tournamentRequest } from "../../requests/tournamentRequest.js";
import { created, notFound, requestError, serverError, succes, unauthorized } from "../../../uitls/response.js";

const populate = [
    { path: "owner" },
    {
        path: "participants",
        populate: "userId",
    }
];

export const index = async (req, res) => {
    try {
        const tournaments = await Tournament.find().populate(populate);
        const data = tournaments.map(tournament => new TournamentResource(tournament));
        return succes(res, data, "All tournaments");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const own = async (req, res) => {
    try {
        const userId = req.user._id;

        const tournaments = await Tournament.find({owner: userId}).populate(populate);
        const data = tournaments.map(tournament => new TournamentResource(tournament));
        return succes(res, data, "Tournaments");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const players = async (req, res) => {
    try {
        const players = await Player.find().populate("userId");
        console.log(players);
        const data = players.map(player => new PlayerWithResource(player));
        return succes(res, data, "All players");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const show = async (req, res) => {
    try {
        const id = req.params.id;

        const tournament = await Tournament.findById(id).populate(populate);
        if (!tournament) {
            return notFound(res, "Tournament not found");
        }

        const data = new TournamentResource(tournament);

        return succes(res, data, "One tournament by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const store = async (req, res) => {
    try {
        const reqData = req.body;
        const userId = req.user._id;

        const { error } = tournamentRequest.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const tournament = await Tournament.findOne({ name: reqData.name });
        if (tournament) {
            return requestError(res, "There is a competition with this name");
        }

        const newTournament = new Tournament({
            owner: userId, status: "active", ...reqData
        });
        await newTournament.save();
        await newTournament.populate(populate);

        const data = new TournamentResource(newTournament);

        return created(res, data, "Tournament created");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const add = async (req, res) => {
    try {
        const reqData = req.body;
        const { tournamentId, playerId } = req.body;

        const { error } = togglePlayer.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const player = await Player.findById(playerId);
        if (!player) {
            return notFound(res, "Player not found");
        }
        const tournament = await Tournament.findById(tournamentId).populate(populate);
        if (!tournament) {
            return notFound(res, "Tournament not found");
        }

        const check = tournament.participants.some(participant => participant.equals(playerId));
        if (check) {
            return requestError(res, "The player already was added in this tournament");
        }
        tournament.participants.push(playerId);
        await tournament.save();

        const rePopulate = await tournament.populate(populate);

        const data = new TournamentResource(rePopulate);

        return succes(res, data, "Player successfully added by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const remove = async (req, res) => {
    try {
        const reqData = req.body;
        const { tournamentId, playerId } = req.body;

        const { error } = togglePlayer.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const player = await Player.findById(playerId);
        if (!player) {
            return notFound(res, "Player not found");
        }
        const tournament = await Tournament.findById(tournamentId).populate(populate);
        if (!tournament) {
            return notFound(res, "Tournament not found");
        }

        const check = tournament.participants.some(participant => participant.equals(playerId));
        if (!check) {
            return requestError(res, "The player hasn't joined this tournament yet or has already been removed");
        }
        tournament.participants = tournament.participants.filter(oldUser => !oldUser.equals(playerId));
        await tournament.save();

        const rePopulate = await tournament.populate(populate);

        const data = new TournamentResource(rePopulate);

        return succes(res, data, "Player successfully removed by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const update = async (req, res) => {
    try {
        const reqData = req.body;
        const userId = req.user._id;
        const tournamentId = req.params.id;

        const { error } = tournamentRequest.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const checkTournament = await Tournament.findById(tournamentId).populate(populate);
        if (!checkTournament) {
            return notFound(res, "Tournament not found");
        }
        if (checkTournament.owner._id.toString() !== userId.toString()) {
            return unauthorized(res, "You can't update this tournament because you didn't create this tournament");
        }
        if (checkTournament.status == "continues" || checkTournament.status == "inactive") {
            if (shortDate(checkTournament.startAt) !== shortDate(reqData.startAt) || shortDate(checkTournament.finishAt) !== shortDate(reqData.finishAt)) {
                return unauthorized(res, "You can't update the start date or end date of this tournament because this tournament has already started or finished");
            }
        }

        const tournament = await Tournament.findByIdAndUpdate(tournamentId, {
            ...reqData
        }, { new: true });

        const rePopulate = await tournament.populate(populate);
        const data = new TournamentResource(rePopulate);

        return succes(res, data, "Tournament updated by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}