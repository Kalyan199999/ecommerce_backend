const express = require('express');
const router = express.Router();
const { verifyAdmin ,userAuth} = require('../middleware/admin');


const { createOrder,getUserOrders,getAdminOrders } = require('../controllers/orderController');

// craete the new order for user
router.post('/', userAuth, createOrder);

// get the user orders
router.get('/user/:userid', userAuth, getUserOrders);

// get all the orders
router.get('/admin/:adminId', verifyAdmin, getAdminOrders);

module.exports = router;