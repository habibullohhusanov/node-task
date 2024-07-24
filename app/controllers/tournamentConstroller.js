import { notFound, requestError, serverError, succes } from "../../uitls/response.js"
import Player from "../models/playerModel.js";
import Tournament from "../models/tournamentModel.js";
import { joinOrExitInTournament } from "../requests/tournamentRequest.js";
import TournamentResource from "../resources/TournamentResource.js";

const populate = [
    { path: "owner" },
    {
        path: "participants",
        populate: "userId",
    }
];

export const index = async (req, res) => {
    try {
        let status = req.query.status;

        const validStatuses = ['active', 'continues', 'inactive'];
        if (status && !validStatuses.includes(status)) {
            status = 'active';
        }

        const filter = status ? { status } : {};

        const tournaments = await Tournament.find(filter).populate(populate);

        const data = tournaments.map(tournament => new TournamentResource(tournament));

        return succes(res, data, `All${status ? " " + status : ''} tournaments`);
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
export const active = async (req, res) => {
    try {
        const userId = req.user._id;

        const player = await Player.findOne({userId});
        if (!player) {
            return requestError(res, "You haven't entered any information yet");
        }

        const filter = {
            participants: player._id
        }

        const tournaments = await Tournament.find(filter).populate(populate);

        const data = tournaments.map(tournament => new TournamentResource(tournament));

        return succes(res, data, "All tournaments you are participating in");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const finished = async (req, res) => {
    try {
        const userId = req.user._id;

        const player = await Player.findOne({userId});
        if (!player) {
            return requestError(res, "You haven't entered any information yet");
        }

        const filter = {
            status: "inactive",
            participants: player._id
        }

        const tournaments = await Tournament.find(filter).populate(populate);

        const data = tournaments.map(tournament => new TournamentResource(tournament));

        return succes(res, data, "All tournaments you have participated in");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const join = async (req, res) => {
    try {
        const reqData = req.body;
        const { tournamentId } = req.body;
        const userId = req.user._id;

        const player = await Player.findOne({userId});
        if (!player) {
            return requestError(res, "You haven't entered any information yet");
        }

        const { error } = joinOrExitInTournament.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const tournament = await Tournament.findById(tournamentId).populate(populate);
        if (!tournament) {
            return notFound(res, "Tournament not found");
        }

        const check = tournament.participants.some(participant => participant.equals(player._id));
        if (check) {
            return requestError(res, "You are already registered for this tournament");
        }
        tournament.participants.push(player._id);
        await tournament.save();

        const rePopulate = await tournament.populate(populate);

        const data = new TournamentResource(rePopulate);

        return succes(res, data, "you have successfully registered");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const exit = async (req, res) => {
    try {
        const reqData = req.body;
        const { tournamentId } = req.body;
        const userId = req.user._id;

        const player = await Player.findOne({userId});
        if (!player) {
            return requestError(res, "You haven't entered any information yet");
        }

        const { error } = joinOrExitInTournament.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const tournament = await Tournament.findById(tournamentId).populate(populate);
        if (!tournament) {
            return notFound(res, "Tournament not found");
        }

        const check = tournament.participants.some(participant => participant.equals(player._id));
        if (!check) {
            return requestError(res, "The player hasn't joined this tournament yet or has already been removed");
        }
        tournament.participants = tournament.participants.filter(oldPlayer => !oldPlayer.equals(player._id));
        await tournament.save();

        const rePopulate = await tournament.populate(populate);

        const data = new TournamentResource(rePopulate);

        return succes(res, data, "Player successfully removed by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}