const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// register new user
router.post('/register', authController.register);

// login user
router.post('/login', authController.login);

module.exports = router;
