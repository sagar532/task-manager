const express = require('express');
const router = express.Router();
const { getUser, getUserTasks } = require('../controllers/admin');
const { verifyJwtToken } = require('../middlewares/auth')

/*
* Get details of all users
*/
router.get('/users',
    verifyJwtToken,
    getUser)

/*
* Get all tasks for a specific user by user ID
*/
router.get('/users/:userId/tasks',
    verifyJwtToken,
    getUserTasks)

module.exports = router;