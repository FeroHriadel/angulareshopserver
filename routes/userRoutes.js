const express = require('express');
const router = express.Router();
const { signup, getUsers, getUser, updateUser, login, getUserCount } = require('../controllers/userControllers');
const { requireSignin } = require('../middleware/authCheck');



router.post('/signup', signup);
router.post('/login', login);
router.get('/getusers', getUsers);
router.get('/getuser/:userId', getUser);
router.put('/updateuser/:userId', requireSignin, updateUser);
router.get('/getusercount', getUserCount);



module.exports = router;