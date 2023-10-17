const express = require('express');
const {
    createActivity,
    getActivities,
    getActivity,
    deleteActivity,
    updateActivity,
    deleteActivities
} = require('../controllers/controllers');
const router = express.Router();

// boilerplate routes
router.get('/', getActivities);

router.get('/:id', getActivity);

router.post('/', createActivity);

router.delete('/:id', deleteActivity);

router.delete('/', deleteActivities);

router.patch('/:id', updateActivity);

module.exports = router;