const Payment = require("../models/payments");
const razorpayInstance = require("../utils/razorpay");
const { membershipAmount } = require("../utils/constant");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

const createOrderPayment = async (req, res) => {
  try {
    const {membershipType} = req.body;
    const { name, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt1",
      notes: {
        name,
        emailId,
        membershipType: membershipType,
      },
    });
    console.log(order);

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
    console.log(err);
  }
};


const webhookPayment = async(req,res) => {
     try{
      const webhookSignature = req.get("X-Razorpay-Signature");
      
      const isWebhookValid = validateWebhookSignature(
        JSON.stringify(req.body),
        webhookSignature,
        process.env.RAZORPAY_WEBHOOK_SECRET
      );

      if(!isWebhookValid){
        return res.status(400).json({message:"Webhook signature is invalid"});
      }

      const paymentDetails = req.body.payload.payment.entity;
      
      const payment = await Payment.findOne({ orderId: paymentDetails.order_id});
      payment.status = paymentDetails.status;
      await payment.save();


      const user = await User.findOne({_id: payment.userId});
      user.isPremium = true;
      user.membershipType = payment.notes.membershipType;

      await user.save();

      return res.status(200).json({message: "Webhook received successfully"});

     }catch (err) {
    res.status(400).send("An error occurred: " + err.message);
    console.log(err);
  }
}

module.exports = { createOrderPayment,webhookPayment};
