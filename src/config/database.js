const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect('mongodb+srv://atharv2003:atharvsinha@nodejs.5lmxckt.mongodb.net/?retryWrites=true&w=majority&appName=Nodejs/findingDev');
}

module.exports = connectDB;