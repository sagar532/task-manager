const jwt = require('jsonwebtoken');
const UrlPattern = require('url-pattern');
const { getUser } = require('../services/user')
const permission_json = require('../config/permission.json')

/** generate jwt token */
const generateJwtToken = async (payload) => {
    return await new Promise(async (resolve, reject) => {
        let token = jwt.sign(
            payload,
            process.env.TOKEN_SECRETE_KEY,
            { expiresIn: process.env.TOKEN_EXPIRE_HOURS }
        );
        //generate refresh token
        let refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRETE_KEY,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_HOURS }
        );
        resolve({ token: token, refreshToken: refreshToken });
    })
}

/** verify jwt token */
async function verifyJwtToken(req, res, next) {
    /** Verify Jwt Token */
    const bearerHeader = req.headers["authorization"];
    //check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
        //split the space at the bearer
        const bearer = bearerHeader.split(" ");
        //Get token from string
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        await decodeJwtToken(req.token)
            .then(async (decoded) => {
                //next middleweare
                res.locals.userId = decoded.userId;
                res.locals.emailId = decoded.emailId;
                let url = req.originalUrl.split("/?").shift();
                url = url.split("?").shift();
                const method = req.method;
                const emailId = decoded.emailId;
                const result = await getUser(
                    emailId
                ).catch(error => {
                    return res.status(500).send({ "error": error });
                })
                if (result['role']) {
                    const role = result['role'];
                    await ProtectApiRbac(
                        role, url, method
                    ).then(response => {
                        if (response) {
                            next();
                        } else {
                            return res.status(401).send({ "error": "unauthorized" });
                        }
                    }).catch(error => {
                        return res.status(500).send({ "error": error });
                    });
                } else {
                    res.status(401).send({ "error": "User does not exist" });
                }
            }).catch((error) => {
                res.status(401).send({ "error": "Invalid Token" });
            });
    } else {
        //Forbidden
        return res.status(401).send({ "error": "Required token" });
    }
}

/** Decode jwt token */
const decodeJwtToken = async (token) => {
    return await new Promise(async (resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRETE_KEY, async function (err, decoded) {
            if (err) {
                reject(err);
            } else {
                //next middleware
                resolve(decoded);
            }
        });
    });
}

/**
 * Protect api wrt role, scope
*/
const ProtectApiRbac = async (role, url, method) => {
    try {
        // get scopes of user role permission
        let scopes = permission_json.filter(x => x.roles.includes(role));
        // ternary operator define to add default empty arry bcs if not included json then not allow api
        scopes = scopes === null ? [] : scopes;
        if (!scopes.length || !scopes) {
            return false;
        }
        // get scope of urls if * contains then has all access else check particular url
        let scopeUrl = scopes[0]['method'][method.toLowerCase()];
        if (!scopeUrl) {
            return false;
        } else if (scopeUrl === '*') {
            return true;
        } else {
            let isMatched = false;
            scopeUrl.forEach(element => {
                let pattern = new UrlPattern(element);
                if (pattern.match(url)) {
                    isMatched = true;
                    return true
                }
            });
            return isMatched;
        }
    } catch (err) {
        return false
    }
}

module.exports = {
    generateJwtToken,
    verifyJwtToken
}