require('dotenv').config();
const express = require("express")
const cors = require("cors");
const stripe = require("stripe")('sk_test_51QyLTRQvrMo8HSYxuzAF1iM5SuCD9GSHYVI9LFDILs9bzWivlkZuqXhNVaW1mIybRvLPUjqGliJhqOLbpDbbmerl00lmuY2W95')

const app = express();
app.use(cors())
app.use(express.json()); 

app.get('/api/success-payment', async(req, res)=>{
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).send('Missing session_id');
    }

 try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("🚀 ~ app.post ~ session:", session.status)
    
    const uid = session.metadata.uid;
    // res.redirect(`http://localhost:5173/success?status=${session.status}&uid=${uid}&sessionId=${sessionId}`)
    res.redirect(`https://scoopn-clean.vercel.app/success?status=${session.status}&uid=${uid}&sessionId=${sessionId}`)


} catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).send('Error processing payment');
  }
})
    

app.listen(8100, function () {
    console.log('listening on port 8100');
});