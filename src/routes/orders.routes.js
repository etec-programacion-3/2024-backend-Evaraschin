const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, ordersController.createOrder);
router.get('/user/:userId', verifyToken, ordersController.getOrdersByUser);

module.exports = router;