const dbUtils = require('../config/database');
const bcrypt = require('bcryptjs')

/**
 * Create a new user
 * @returns {Promise<Object>} A promise that resolves to the result of the user creation operation
 */
const createUser = async (userName, email, password, role) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const defaultRole = role ? role : 'user'
            const query = `INSERT 
                                INTO task_manager.users (
                                user_name,
                                email, 
                                password,
                                role
                                ) VALUES (
                                 ?, ?, ?, ?
                                )`;
            const values = [userName, email, hashedPassword, defaultRole];
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
 * Retrieve user details by email for validation
 * @returns {Promise<Object>} A promise that resolves to the user details, including password and role
 */
const getUser = async (email) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const query = `select 
                               id "userId",
                               user_name "userName",
                               email,
                               password,
                               role
                            from  task_manager.users
                            where email=? `;
            const values = [email];
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

module.exports = {
    createUser, getUser
}