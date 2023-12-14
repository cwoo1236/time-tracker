const express = require('express');
const {
    createActivity,
    getActivities,
    getActivity,
    deleteActivity,
    updateActivity,
    deleteActivities,
    updateTimeTotal,
    getTimeTotals,
    createTimeTotal,
    deleteTimeTotal,
    sendEmail
} = require('../controllers/controllers');
const router = express.Router();

router.get('/activities/', getActivities);

router.get('/activities/:id', getActivity);

router.post('/activities/', createActivity);

router.delete('/activities/:id', deleteActivity);

router.delete('/activities/', deleteActivities);

router.patch('/activities/:id', updateActivity);

router.patch('/timeTotals/:name', updateTimeTotal);

router.get('/timeTotals/', getTimeTotals);

router.post('/timeTotals/', createTimeTotal);

router.delete('/timeTotals/:id', deleteTimeTotal);

router.post('/email/:addr', sendEmail);

module.exports = router;