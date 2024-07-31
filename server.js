const express = require("express");

const app = express();

const dbConfig = require('./db.js')
const roomsRoute = require('./routes/roomsRoute')
const userRoute = require('./routes/usersRoute.js')
const bookingRoute = require('./routes/bookingRoute.js')

app.use(express.json());
app.use('/api/rooms',roomsRoute)
app.use('/api/users',userRoute)
app.use('/api/bookings', bookingRoute)

const port = process.env.PORT || 5000;

app.listen(port,()=>console.log(`node server started using nodemon`));