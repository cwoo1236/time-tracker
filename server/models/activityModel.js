const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema({
    activityName: {
        type: String,
        required: true
    },
    startHour: {
        type: String,
        required: true
    },
    startMin: {
        type: String,
        required: true
    },
    endHour: {
        type: String,
        required: true
    },
    endMin: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: false
    },
    activityDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);