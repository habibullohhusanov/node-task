import Joi from "joi";

export const tournamentRequest = Joi.object({
    name: Joi.string().required(),
    startAt: Joi.date().required(),
    finishAt: Joi.date().required(),
});
export const togglePlayer = Joi.object({
    tournamentId: Joi.string().required(),
    playerId: Joi.string().required(),
});
export const joinOrExitInTournament = Joi.object({
    tournamentId: Joi.string().required(),
});
