import Joi from "joi";

const registerUserValidation = Joi.object({
  name: Joi.string().max(100).required(),
  username: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  photo: Joi.string().max(100).optional(),
});

const loginUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().min(8).max(100).required(),
});

const getUserValidation = Joi.number().required();

const updateUserValidation = Joi.object({
  name: Joi.string().max(100).optional(),
  username: Joi.string().max(100).optional(),
  email: Joi.string().email().optional(),
  photo: Joi.string().max(100).optional(),
});

const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().min(8).max(100).required(),
  newPassword: Joi.string().min(8).max(100).required(),
  confirmNewPassword: Joi.string().min(8).max(100).required(),
});

export {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
  changePasswordValidation,
};
