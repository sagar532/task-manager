const express = require('express');
const router = express.Router();
const { createTasks, updateTasks, getTasksLists, getTasksById, deleteTasks } = require('../controllers/task');
const { createTasksValidation, updateTasksValidation, userTaskValidation} = require('../validation/task');
const { verifyJwtToken } = require('../middlewares/auth')

/*
* Create a new task for the user
*/
router.post('/',
    verifyJwtToken,
    createTasksValidation,
    createTasks)

/*
* Update an existing user task by task ID
*/
router.put('/:taskId',
    verifyJwtToken,
    userTaskValidation,
    updateTasksValidation,
    updateTasks)

/*
* Get a list of all tasks for the user
*/
router.get('/list',
    verifyJwtToken,
    getTasksLists)

/*
* Get a specific task by task ID for the user
*/
router.get('/:taskId',
    verifyJwtToken,
    userTaskValidation,
    getTasksById)

/*
* Delete a specific user task by task ID
*/
router.delete('/:taskId',
    verifyJwtToken,
    userTaskValidation,
    deleteTasks)

module.exports = router;