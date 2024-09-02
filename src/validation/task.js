const { uncaughtException, badRequestException } = require('../middlewares/response')
const Validator = require("jsonschema").Validator;
const schemaHelper = require('./schemaError');
const { getUserTask } = require('../services/task')

/**
 * Create a new task for the user validation 
 */
const createTasksValidation = async (req, res, next) => {
    try {
        const bodyObj = req.body;
        // Create a json schema
        let schema = {
            "id": "/schema",
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 50,
                    "required": true
                },
                "description": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 240,
                    "required": true
                }
            },
        };
        const v = new Validator();
        const validationResult = v.validate(bodyObj, schema).valid;
        if (validationResult) {
            next()
        } else {
            const error = await schemaHelper.getErrorMessage(v.validate(bodyObj, schema).errors);
            return res.status(400).send(await badRequestException({ "message": error }))
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(await uncaughtException(err));
    }
}

/**
 * Update task for the user validation 
 */
const updateTasksValidation = async (req, res, next) => {
    try {
        const bodyObj = req.body;
        // Create a json schema
        let schema = {
            "id": "/schema",
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 50,
                    "required": true
                },
                "description": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 240,
                    "required": true
                },
                "status": {
                    "type": "string",
                    "enum": ['pending', 'in-progress', 'completed'],
                    "required": true
                },
            },
        };
        const v = new Validator();
        const validationResult = v.validate(bodyObj, schema).valid;
        if (validationResult) {
            next()
        } else {
            const error = await schemaHelper.getErrorMessage(v.validate(bodyObj, schema).errors);
            return res.status(400).send(await badRequestException({ "message": error }))
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(await uncaughtException(err));
    }
}

/**
 * User task validation 
 */
const userTaskValidation = async (req, res, next) => {
    try {
        const userId = res.locals.userId;
        const taskId = req.params.taskId;

        const userTasks = await getUserTask(taskId, userId);
        if (userTasks) {
            next()
        } else {
            return res.status(400).send(await badRequestException({ "message": "The task Id does not exists" }))
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(await uncaughtException(err));
    }
}

module.exports = {
    createTasksValidation,
    updateTasksValidation,
    userTaskValidation
}