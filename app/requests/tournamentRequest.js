import Joi from "joi";

export const tournamentRequest = Joi.object({
    name: Joi.string().required(),
    startAt: Joi.date().required(),
    finishAt: Joi.date().required(),
});
export const togglePlayer = Joi.object({
    tournamentsId: Joi.string().required(),
    userId: Joi.string().required(),
});
