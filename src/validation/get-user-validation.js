const Joi = require('Joi');
module.exports = Joi.string().uuid().required()