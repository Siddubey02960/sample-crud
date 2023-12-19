const express = require('express');

const apiRoutes = express.Router();

const userRoutes = require('./user-routes');

apiRoutes.use('/api/users', [userRoutes]);

module.exports = apiRoutes;
