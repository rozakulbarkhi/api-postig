import Joi from "joi";

const createPostValidation = Joi.object({
  image: Joi.string().max(100).required(),
  caption: Joi.string().max(100).required(),
  tags: Joi.string().max(100).required(),
  likes: Joi.number().optional(),
});

const updatePostValidation = Joi.object({
  id: Joi.number().required(),
  image: Joi.string().max(100).optional(),
  caption: Joi.string().max(100).optional(),
  tags: Joi.string().max(100).optional(),
  likes: Joi.number().optional(),
});

const getPostValidation = Joi.object({
  id: Joi.number().required(),
});

const searchPostValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  limit: Joi.number().min(1).positive().max(100).default(10),
  caption: Joi.string().max(100).optional(),
  tags: Joi.string().max(100).optional(),
  search: Joi.string().max(100).optional(),
});

const searchPostByUserValidation = Joi.object({
  id: Joi.number().required(),
  page: Joi.number().min(1).positive().default(1),
  limit: Joi.number().min(1).positive().max(100).default(10),
  caption: Joi.string().max(100).optional(),
  tags: Joi.string().max(100).optional(),
  search: Joi.string().max(100).optional(),
});

export {
  createPostValidation,
  updatePostValidation,
  getPostValidation,
  searchPostValidation,
  searchPostByUserValidation,
};
