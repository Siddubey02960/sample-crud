const express = require('express');
const userController = require('../controllers/user-controller');

const userRoutes = express.Router({ mergeParams: true });

userRoutes.get('/', userController.getList);
userRoutes.get('/:userId', userController.getOne);
userRoutes.post('/', userController.addOne);
userRoutes.put('/:userId', userController.updateOne);
userRoutes.delete('/:userId', userController.deleteOne);

module.exports = userRoutes;
