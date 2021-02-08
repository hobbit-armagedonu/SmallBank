const express = require('express');
const { body, validationResult } = require('express-validator');
const individuals = require('./lib/individuals');
const { login } = require('./lib/sessionService');

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

router.use('/individuals', individuals);

module.exports = router;
