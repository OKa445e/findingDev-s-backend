const express = require("express");
const { userauth } = require("../middleware/auth");
const {
  createOrderPayment,
  webhookPayment,
  paymentVerification,
} = require("../controller/paymentController");

const paymentrouter = express.Router();

paymentrouter.post("/payment/create", userauth, createOrderPayment);

paymentrouter.post("/payment/webhook", webhookPayment);

paymentrouter.get("/premium/verify", userauth, paymentVerification);

module.exports = paymentrouter;
