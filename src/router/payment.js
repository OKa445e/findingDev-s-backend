const express = require("express");
const { userauth } = require("../middleware/auth");
const {
  createOrderPayment,
  webhookPayment,
} = require("../controller/paymentController");

const paymentrouter = express.Router();

paymentrouter.post("/payment/create", userauth, createOrderPayment);

paymentrouter.post("/payment/webhook", webhookPayment);

module.exports = paymentrouter;
