const Activity = require('../models/activityModel');
const timeTotalModel = require('../models/timeTotalModel');
const TimeTotal = require('../models/timeTotalModel');
const mongoose = require('mongoose');

// GET all activities
const getActivities = async (req, res) => {
    const activities = await Activity.find({}).sort({createdAt: -1});

    res.status(200).json(activities);
}

// GET one
const getActivity = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such activity'})
    }

    const activity = await Activity.findById(id);

    if (!activity) {
        return res.status(404).json({error: 'No such activity'});
    } 

    res.status(200).json(activity);
}

// POST one
const createActivity = async (req, res) => {
    const {activityName, startHour, startMin, endHour, endMin, duration} = req.body;
    
    // add doc to db
    try {
        const activity = await Activity.create({activityName, startHour, startMin, endHour, endMin, duration});
        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// DELETE one
const deleteActivity = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such activity'})
    }

    const activity = await Activity.findOneAndDelete({_id: id});

    if (!activity) {
        return res.status(404).json({error: 'No such activity'});
    } 

    res.status(200).json(activity);
}

// DELETE all activities
const deleteActivities = async (req, res) => {
    const activities = await Activity.deleteMany({});

    res.status(200).json(activities);
}

// UPDATE one
const updateActivity = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such activity'})
    }

    const activity = await Activity.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!activity) {
        return res.status(404).json({error: 'No such activity'});
    } 

    res.status(200).json(activity);
}

// GET all timetotals
const getTimeTotals = async (req, res) => {
    const timeTotals = await TimeTotal.find({}).sort({value: -1});

    res.status(200).json(timeTotals);
}

// POST timetotal
const createTimeTotal = async (req, res) => {
    const { name, value, fill } = req.body;
    try {
        const timeTotal = await TimeTotal.create({name, value, fill});
        res.status(200).json(timeTotal);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateTimeTotal = async (req, res) => {
    const {id} = req.params;

    const timeTotal = await TimeTotal.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!timeTotal) {
        return res.status(404).json({error: 'No such timeTotal'});
    } 

    res.status(200).json(timeTotal);
}

const deleteTimeTotal = async (req, res) => {
    const { id } = req.params;

    const timeTotal = await TimeTotal.findOneAndDelete({_id: id});

    if (!timeTotal) {
        return res.status(404).json({error: 'No such timeTotal'});
    } 

    res.status(200).json(timeTotal);
}

module.exports = {
    getActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    deleteActivities,
    updateTimeTotal,
    getTimeTotals,
    createTimeTotal,
    deleteTimeTotal
}