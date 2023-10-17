const Activity = require('../models/activityModel');
const mongoose = require('mongoose');

// GET all
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

module.exports = {
    getActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    deleteActivities
}