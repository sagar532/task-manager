const express = require('express');
const router = express.Router();
const { createUser, generateJwt } = require('../controllers/user');
const { createUserValidation, loginValidation } = require('../validation/user');
const { verifyJwtToken } = require('../middlewares/auth')

/*
* Create a new user
*/
router.post('/create',
    verifyJwtToken,
    createUserValidation,
    createUser)

/*
* Log in a user with their email address and password
*/
router.post('/login',
    loginValidation,
    generateJwt)

module.exports = router;