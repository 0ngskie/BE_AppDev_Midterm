const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Basic GET Route for Accounts
router.get('/getAllUsers', userController.getAllUsers);

module.exports = router;