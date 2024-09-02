const taskService = require('../services/task');
const { uncaughtException, successResponse } = require('../middlewares/response')

/**
 * Create a new task for the user
 * @param {body} 
 */
const createTasks = async (req, res, next) => {
    const { title, description } = req.body;
    const userId = res.locals.userId;
    await taskService.createTasks(
        title, description, userId
    ).then(async (result) => {
        return res.status(201).send(await successResponse(null, "Task created successfully"));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
}

/**
 * Update a task by task ID
 * @param {query} taskId
 */
const updateTasks = async (req, res, next) => {
    const { title, description, status } = req.body;
    const taskId = req.params.taskId;
    await taskService.updateTasks(
        title, description, status, taskId
    ).then(async (result) => {
        return res.status(201).send(await successResponse(null, "Task update successfully"));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
}

/**
 * Get a paginated list of tasks for the authenticated user
 * @param {query} page - (Optional) Page number for pagination.
 * @param {query} pageCount - (Optional) Number of records to be displayed per page.
 */
const getTasksLists = async (req, res, next) => {
    const page = req.query.page;
    const pageCount = req.query.pageCount;
    const userId = res.locals.userId;
    await taskService.getTasksLists(
        page, pageCount, userId
    ).then(async (result) => {
        return res.status(200).send(await successResponse(result));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
}

/**
 * Get a specific task by task ID for the authenticated user
 * @param {query} taskId 
 */
const getTasksById = async (req, res, next) => {
    const taskId = req.params.taskId;
    const userId = res.locals.userId;
    await taskService.getTasksById(
        taskId, userId
    ).then(async (result) => {
        return res.status(200).send(await successResponse(result));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
}

/**
 * Delete a task by task ID for the authenticated user
 * @param {query} taskId
 */
const deleteTasks = async (req, res, next) => {
    const taskId = req.params.taskId;
    await taskService.deleteTasks(
        taskId
    ).then(async (result) => {
        return res.status(200).send(await successResponse(null, 'Task deleted successfully'));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
}

module.exports = {
    createTasks,
    updateTasks,
    getTasksLists,
    getTasksById,
    deleteTasks
}