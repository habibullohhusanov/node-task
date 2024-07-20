import Joi from "joi";

export const loginRequest = Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
});
export const registerRequest = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    password_confirmation: Joi.ref('password'),
});
export const userUpdateDataRequest = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
});
export const userUpdatePasswordRequest = Joi.object({
    old_password: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
    password_confirmation: Joi.ref('password'),
});
export const userResetPasswordRequest = Joi.object({
    password: Joi.string().min(4).required(),
    password_confirmation: Joi.ref('password'),
});
export const userDestroyRequest = Joi.object({
    password: Joi.string().min(4).required(),
});
export const userPlayerData = Joi.object({
    name: Joi.string().allow(),
    age: Joi.number().required(),
    country: Joi.string().required(),
});
export const changeRoleUser = Joi.object({
    role: Joi.string().valid('admin', 'user').required(),
});