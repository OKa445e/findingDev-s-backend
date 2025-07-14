const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect('mongodb+srv://atharvdav:atharvaSinha@findingdev.rqdybdc.mongodb.net/?retryWrites=true&w=majority&appName=FindingDev');
}
module.exports = connectDB;