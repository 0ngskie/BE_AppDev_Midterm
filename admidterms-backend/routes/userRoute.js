const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Basic GET Route for Accounts
router.get('/getAllUsers', userController.getAllUsers);

router.get('/getUser/:user_id', userController.getUser);
router.post('/createUser', userController.createUser);
router.put('/updateUser', userController.updateUser);
router.delete('/deleteUser', userController.deleteUser);

module.exports = router;