const express = require('express');
const { body, validationResult } = require('express-validator');
const individuals = require('./lib/individuals');
const { login, getSessionEntitlementsProfile } = require('./lib/sessionService');

const router = express.Router();

/**
 curl -X POST -H "Content-Type: application/json" -d '{"token": "xxxx"}' \
    http://localhost:3000/login
 */

const validationErrorFormat = validationResult.withDefaults(
    {
        formatter: (error) => ({
            code: 'VAL-LOGIN',
            message: error.msg,
            field: error.param,
        }),
    },
);

const getSessionEntitlements = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No authorization header' });
    }
    const authHeader = req.headers.authorization.split(' ');
    if (authHeader[0] !== 'Bearer') {
        return res.status(403).json({ error: 'Unsupported authorization header' });
    }
    const token = authHeader[1];
    if (!token) {
        return res.status(403).json({ error: 'Invalid token' });
    }
    let profile;
    try {
        profile = await getSessionEntitlementsProfile(token);
        Object.assign(req, { sessionEntitlementsProfile: profile });
        next();
    } catch (e) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

router.post('/login',
    body('api_key', 'Body parameter: api_key not provided.').exists(),
    async (req, res) => {
        const errors = validationErrorFormat(req).array();
        if (errors.length) {
            return res.status(400).json({ errors });
        }
        const { api_key: token } = req.body;
        /* a good idea would be to base64 encode it if we're going live */
        let session;
        try {
            session = await login(token);
        } catch (e) {
            res.status(400);
            return res.send({ error: e.message });
        }
        return res.send({ access_token: session });
    });

router.use(getSessionEntitlements);
router.use('/individuals', individuals);

module.exports = router;
