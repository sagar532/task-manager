const express = require('express');
const router = express.Router();
const userRouter = require('./user.js');
const taskRouter = require('./task.js');
const adminRouter = require('./admin.js');

/* Route handling for user-related operations */
router.use('/user', userRouter);

/* Route handling for task-related operations */
router.use('/tasks', taskRouter);

/* Route handling for admin-related operations */
router.use('/admin', adminRouter);

module.exports = router;