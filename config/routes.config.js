const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// User Routes
router.post('/auth/login', usersController.login);
router.post('/auth/signup', usersController.signup);
// router.post('/auth/upload', authMiddleware.isAuthenticated, usersController.upload);
router.put('/auth/edit', authMiddleware.isAuthenticated, usersController.edit);
//router.post('/auth/logout', authMiddleware.isAuthenticated, usersController.logout); // Handled from the frontEnd
router.get('/auth/loggedin', authMiddleware.isAuthenticated, usersController.loggedin);

module.exports = router;