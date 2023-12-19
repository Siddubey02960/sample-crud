const Joi = require('Joi');
module.exports = Joi.object({
    username: Joi.string().required(),
    age: Joi.number().required(),
    hobbies: Joi.array().items(Joi.string()).default([]),
  });