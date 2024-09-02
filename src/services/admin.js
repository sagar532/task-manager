const dbUtils = require('../config/database');

/**
 * Retrieve a list of all users 
 * @returns {Promise<Object[]>} - A promise that resolves to an array of user details (userId, userName, email, role)
 */
const getUser = async () => {
    return await new Promise(async (resolve, reject) => {
        try {
            const query = `select 
                               id "userId",
                               user_name "userName",
                               email,
                               role
                            from  task_manager.users
                            where role='user' `;
            const result = await dbUtils.execute_query_return_query_result(query)
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
 * Retrieve all tasks for a specific user by their user ID
 * @returns {Promise<Object[]>} - A promise that resolves to an array of tasks (taskId, title, description, status) for the specified user
 */
const getUserTasks = async (userId) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const query = `select 
                                usr.id "userId",
                                usr.user_name "userName",
                                tsk.id "taskId",
                                tsk.title,
                                tsk.description,
                                tsk.status
                            from task_manager.users usr
                            join task_manager.tasks tsk
                            on usr.id=tsk.user_id
                            where usr.id=? `;
            const values = [userId]
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

module.exports = {
    getUser,
    getUserTasks
}