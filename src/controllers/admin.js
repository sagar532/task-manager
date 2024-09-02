const adminService = require('../services/admin');
const { uncaughtException, successResponse } = require('../middlewares/response')

/**
 * Get details of all users
 */
const getUser = async (req, res, next) => {
    await adminService.getUser(
    ).then(async (result) => {
        return res.status(200).send(await successResponse(result));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
}

/**
 * Get all tasks for a specific user by user ID
 */
const getUserTasks = async (req, res, next) => {
    const userId= req.params.userId;
    await adminService.getUserTasks(
        userId
    ).then(async (result) => {
        return res.status(200).send(await successResponse(result));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
}

module.exports = {
    getUser,
    getUserTasks
}