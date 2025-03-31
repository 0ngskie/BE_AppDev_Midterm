const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');


//get all payments
router.get('/', paymentController.getAllPayments);

//get payment by id
router.get('/:id', paymentController.getPaymentById);
//create payment

router.post('/', paymentController.createPayment);
//update payment
router.put('/:id', paymentController.updatePayment);

//delete payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;