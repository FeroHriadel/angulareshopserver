const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrder, deleteOrder, getUsersOrders } = require('../controllers/orderControllers');
const { requireSignin, requireAdmin } = require('../middleware/authCheck');



router.post('/createorder', requireSignin, createOrder);
router.get('/getorders', requireSignin, requireAdmin, getOrders);
router.get('/getorder/:orderId', getOrder);
router.put('/updateorder/:orderId', requireSignin, requireAdmin, updateOrder);
router.delete('/deleteorder/:orderId', requireSignin, requireAdmin, deleteOrder);
router.get('/getusersorders/:userId', getUsersOrders)




module.exports = router;