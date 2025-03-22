require('dotenv').config();
const express = require("express")
const cors = require("cors")
const stripe = require("stripe")('sk_test_51QyLTRQvrMo8HSYxuzAF1iM5SuCD9GSHYVI9LFDILs9bzWivlkZuqXhNVaW1mIybRvLPUjqGliJhqOLbpDbbmerl00lmuY2W95')

const app = express();
app.use(cors())
app.use(express.json()); 

app.post('/api/create-checkout-session', async(req, res)=>{
    const {uid, customerEmail, totalprice} = req.body
    console.log(req.body);

    if(!totalprice && !uid && !customerEmail){
        console.log("Invalid fields");
        return
    }
    try{
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Booking Payment',
                },
                unit_amount: totalprice * 100, 
              },
            quantity: 1,
          },
        ],
        mode: 'payment',
        // success_url: 'http://localhost:8100/api/success-payment?session_id={CHECKOUT_SESSION_ID}',
        // cancel_url: 'http://localhost:5173/cancel',

        success_url: 'https://scoopn-clean-server.vercel.app/api/success-payment?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://scoopn-clean.vercel.app/cancel',

        customer_email: `${customerEmail}`,
        metadata: {uid: uid},
      });
      console.log("🚀 ~ app.post ~ session:", session)
      res.json({session})
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).send('Error processing payment');
    }
});

app.listen(8000, function () {
    console.log('listening on port 8000');
});