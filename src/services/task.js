const dbUtils = require('../config/database');

/**
 * Create a new task for a user
 * @returns {Promise<Object>} A promise that resolves to the result of the task creation operation
 */
const createTasks = async (title, description, userId) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const query = `INSERT 
                                INTO task_manager.tasks (
                                title,
                                description, 
                                user_id
                                ) VALUES (
                                 ?, ?, ?
                                )`;
            const values = [title, description, userId];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            resolve(result);
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

/**
 * Update an existing task by task ID
 * @returns {Promise<Object>} A promise that resolves to the result of the task update operation
 */
const updateTasks = async (title, description, status, taskId) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const query = `update task_manager.tasks 
                            set title = ?,
                            description = ?,
                            status = ?
                        where id= ?                             `;
            const values = [title, description, status, taskId];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            resolve(result);
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

/**
 * Get a paginated list of tasks for a specific user
 * @returns {Promise<Object>} A promise that resolves to an object containing paginated task details and metadata
 */
const getTasksLists = async (page, pageCount, userId) => {
    return await new Promise(async (resolve, reject) => {
        try {
            // Parse the pageCount and page parameters to integers, using a default value from the environment if necessary.
            let logsLimit = ''
            if (pageCount && !isNaN(pageCount)) {
                logsLimit = parseInt(pageCount);
            } else {
                logsLimit = parseInt(process.env.PAGINATION_PAGE_COUNT);
            }
            // Check if page number is provided, otherwise set the default page number to 1
            let pageNo = ''
            if ((page && !isNaN(page) && page !== '0')) {
                pageNo = parseInt(page);
            } else {
                pageNo = 1;
            }
            // Calculate the offset for pagination.
            const offset = (pageNo - 1) * logsLimit;

            // Get total tasks count
            const totalCount = await tasksCounts(userId);

            const query = `select 
                                id,
                                title,
                                description,
                                status
                            from task_manager.tasks 
                            where user_id=?
                             LIMIT ? OFFSET ?`;
            const values = [userId, logsLimit, offset];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })

            // Calculate the total number of pages based on the total record count and page count.
            const totalPages = Math.ceil(totalCount / logsLimit);

            // Create the metadata object containing pagination details.
            const metadata = {
                totalRecordCount: totalCount,
                currentPage: pageNo,
                perPage: logsLimit,
                maxPage: totalPages
            };

            const records = result.length > 0 ? result : [];

            const response = {
                metadata: metadata,
                records: records
            };
            resolve(response);
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

/**
 * Get total task for user by user Id
 * @param {*} userId 
 * @returns total task count
 */
const tasksCounts = async (userId) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const query = `select 
                               count(*) as total
                            from task_manager.tasks 
                            where user_id=?`;
            const values = [userId];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            resolve(result[0]['total']);
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

/**
 * Get details of a specific task by task ID for a specific user
 * @returns {Promise<Object>} A promise that resolves to the task details
 */
const getTasksById = async (taskId, userId) => {
    return await new Promise(async (resolve, reject) => {
        try {

            const query = `select 
                                id,
                                title,
                                description,
                                status
                            from task_manager.tasks 
                            where user_id=?
                            and id=?`;
            const values = [userId, taskId];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({});
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

/**
 * Delete a task by task ID for a specific user
 * @returns {Promise<Object>} A promise that resolves to the result of the task deletion operation
 */
const deleteTasks = async (taskId) => {
    return await new Promise(async (resolve, reject) => {
        try {

            const query = `delete 
                            from task_manager.tasks 
                            where id=?`;
            const values = [taskId];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            resolve(result);
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

/**
 * Get user task by user id and task id for validation
 * @returns {Promise<Object>} A promise that resolves to the result of the task details
 */
const getUserTask = async (taskId, userId) => {
    return await new Promise(async (resolve, reject) => {
        try {

            const query = `select
                                * 
                            from task_manager.tasks 
                            where id=? and user_id=?`;
            const values = [taskId, userId];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            if (result.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

module.exports = {
    createTasks,
    updateTasks,
    getTasksLists,
    getTasksById,
    deleteTasks,
    getUserTask
}