const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  getExpireDateFromDate
} = require('arifpay/lib/helper');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors()
);

/* {
    origin: ["http://localhost:3000","https://arifpay-frontend-sample.vercel.app" ],
    methods: ['GET', 'POST','PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false
  } */
const Arifpay = require('arifpay').default;
const arifpay = new Arifpay("vYbDITI6j19eJZo0kBRIBPP6uLZ9jtIM")
const domainURL = "https://arifpay-frontend-sample.vercel.app";

app.post('/api/create-checkout-session', async (req, res) => {

    try {
      const date = new Date();
      date.setMonth(10);
      const expired = getExpireDateFromDate(date);
      let amount = req.body.items.map(e => e.price * e.quantity).reduce((e, c) => e + c)
      console.log(amount);
      const data = {
       ...req.body,
        notifyUrl: `${domainURL}`,
        beneficiaries: [{
          accountNumber: '10000000000',
        bank: 'AWINETAA',
        amount: amount
        }, ],
        paymentMethods: ["CARD"],
        expireDate: expired,
        nonce: Math.floor(Math.random() * 10000).toString(),
        cancelUrl: `${domainURL}/notify`,
        errorUrl: `${domainURL}/error`,
        successUrl: `${domainURL}/success`
      };
  console.log(data)
      const session = await arifpay.checkout.create(data, {
        sandbox: true
      });
      console.log(session);
      return res.json({
        error: false,
        data: session
      });
    } catch (err) {
      console.log(err);
      return res.json({
        error: true,
        msg: err.msg,
        data: err.error
      });
    }
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
