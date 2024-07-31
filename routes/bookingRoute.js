const express = require("express");
const router = express.Router();
const moment = require('moment')

const Booking = require('../models/booking')
const Room = require('../models/room')

const stripe = require('stripe')('sk_test_51Phn1KDjO97zto9GjIP0M4Jf3hd8nf1M0t9uNnICW5dhKLnr5M8TTU4vJPpnjtzxlrpwiFqCuXBv0qFwm60GoyIo00dD2hlXwD')
const { v4: uuidv4 } = require('uuid');

router.post("/bookroom", async (req, res) => {
    const {
        room,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
        token
    } = req.body

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        const payment = await stripe.charges.create(
            {
                amount: totalamount * 100,
                customer: customer.id,
                currency: 'inr',
                receipt_email: token.email
            },
            {
                idempotencyKey: uuidv4()
            }
        )
        if (payment) {
            try {
                const newbooking = new Booking({
                    room: room.name,
                    roomid: room._id,
                    userid,
                    fromdate: moment(fromdate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                    todate: moment(todate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                    totalamount,
                    totaldays,
                    transactionId: payment.id
                })
                const booking = await newbooking.save()
                const roomtemp = await Room.findOne({ _id: room._id })
                roomtemp.currentbookings.push({
                    bookingid: booking._id,
                    fromdate: moment(fromdate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                    todate: moment(todate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                    userid: userid,
                    status: booking.status
                })

                await roomtemp.save()
                res.send('Room booked successfully')

            } catch (error) {
                return res.status(400).json({ error });
            }
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/getbookingsbyuserid",async(req,res)=>{
    const userid = (req.body.userid)

    try{
        const bookings = await Booking.find({userid:userid})
        res.send(bookings)
    }
    catch(error){
        return res.status(400).json({error})
    }
})
module.exports = router