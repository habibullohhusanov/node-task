import { created, notFound, requestError, serverError, succes, unauthorized } from "../../../uitls/response.js";
import Tournament from "../../models/tournamentModel.js";
import User from "../../models/userModel.js";
import { togglePlayer, tournamentRequest } from "../../requests/tournamentRequest.js";
import TournamentResource from "../../resources/TournamentResource.js";

const populate = [
    { path: "owner" },
    { path: "participants" }
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
            return requestError(res, "There is a there is a competition with this name");
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
        const { tournamentId, userId } = req.body;

        const { error } = togglePlayer.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const user = await User.findById(userId);
        if (!user) {
            return notFound(res, "User not found");
        }
        const tournament = await Tournament.findById(tournamentId).populate(populate);
        if (!tournament) {
            return notFound(res, "Tournament not found");
        }

        const check = tournament.participants.includes(userId);
        if (!check) {
            tournament.participants.push(userId);
            await tournament.save();
        } else {
            return requestError(res, " The player already was added in this tournament");
        }

        const data = new TournamentResource(tournament);

        return succes(res, data, "Player successfully added by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}
export const remove = async (req, res) => {
    try {
        const reqData = req.body;
        const { tournamentId, userId } = req.body;

        const { error } = togglePlayer.validate(reqData);
        if (error) {
            return requestError(res, error.message);
        }

        const user = await User.findById(userId);
        if (!user) {
            return notFound(res, "User not found");
        }
        const tournament = await Tournament.findById(tournamentId).populate(populate);
        if (!tournament) {
            return notFound(res, "Tournament not found");
        }

        const check = tournament.participants.includes(userId);
        if (!check) {
            return requestError(res, "The player hasn't joined this tournament yet");
        } else {
            tournament.participants = tournament.participants.filter(oldUser => oldUser != userId);
            await tournament.save();
        }

        const data = new TournamentResource(tournament);

        return succes(res, data, "Player successfully added by id");
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
        if (checkTournament.owner !== userId) {
            return unauthorized(res)
        }
        if (checkTournament.status == "continues") {
            if (checkTournament.startAt !== reqData.startAt || checkTournament.finishAt !== reqData.finishAt) {
                return unauthorized(res, "You can't update the start date or end date of this tournament because this tournament has already started");
            }
        }

        const tournament = await Tournament.findByIdAndUpdate(tournamentId, {
            ...reqData
        }, { new: true });

        const data = new TournamentResource(tournament);

        return succes(res, data, "Tournament updated by id");
    } catch (error) {
        return serverError(res, error.message);
    }
}