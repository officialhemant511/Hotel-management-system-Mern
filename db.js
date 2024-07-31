const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://officialhemant511:mvq9HTMMyQgUtEn3@cluster0.wc6lomr.mongodb.net/mern-rooms'

mongoose.connect(mongoURL);

var connection = mongoose.connection

connection.on('error', () => {
    console.log('Mongo DB connection failed');
})

connection.on('connected', () => {
    console.log('Mongo is connected sucessfully');
})

module.exports = mongoose