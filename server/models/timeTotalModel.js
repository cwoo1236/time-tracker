const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const timeTotalSchema = new mongoose.Schema({
    name: { type: String },
    value: { type: Number },
    fill: { type: String }
});

module.exports = mongoose.model('TimeTotal', timeTotalSchema);