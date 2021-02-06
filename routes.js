const express = require('express');
const { body, validationResult } = require('express-validator');
const individuals = require('./lib/individuals');
const { login } = require('./lib/sessionService');

const router = express.Router();

/**
 curl -X POST -H "Content-Type: application/json" -d '{"token": "xxxx"}' \
    http://localhost:3000/login
 */

const validationFormat = validationResult.withDefaults(
    {
        formatter: (error) => ({
            code: 'LOG-VAL-KEY',
            message: error.msg,
            field: error.param,
        }),
    },
);

router.post('/login',
    body('api_key', 'Body parameter: api_key not provided.').exists(),
    async (req, res) => {
        const errors = validationFormat(req).array();
        if (errors.length) {
            return res.status(400).json({ errors });
        }
        const { api_key: token } = req.body;
        const session = await login(token);
        return res.send({ access_token: session });
    });

router.use('/individuals', individuals);

module.exports = router;
