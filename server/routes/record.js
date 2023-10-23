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
    deleteTimeTotal
} = require('../controllers/controllers');
const router = express.Router();

router.get('/activities/', getActivities);

router.get('/activities/:id', getActivity);

router.post('/activities/', createActivity);

router.delete('/activities/:id', deleteActivity);

router.delete('/activities/', deleteActivities);

router.patch('/activities/:id', updateActivity);

router.patch('/timeTotals/', updateTimeTotal);

router.get('/timeTotals/', getTimeTotals);

router.post('/timeTotals/', createTimeTotal);

router.delete('/timeTotals/:id', deleteTimeTotal);

module.exports = router;