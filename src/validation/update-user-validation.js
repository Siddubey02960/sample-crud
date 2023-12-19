const Joi = require('Joi');
module.exports = Joi.object({
    username: Joi.string(),
    age: Joi.number(),
    hobbies: Joi.array().items(Joi.string()).default([]),
  });