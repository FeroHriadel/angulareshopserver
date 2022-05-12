const express = require('express');
const router = express.Router();
const { signup, getUsers, getUser, updateUser, login } = require('../controllers/userControllers');



router.post('/signup', signup);
router.post('/login', login);
router.get('/getusers', getUsers);
router.get('/getuser/:userId', getUser);
router.put('/updateuser/:userId', updateUser);



module.exports = router;