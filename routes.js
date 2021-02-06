const express = require('express');
const individuals = require('./lib/individuals');
const { login } = require('./lib/sessionService');

const router = express.Router();

/**
 curl -X POST -H "Content-Type: application/json" -d '{"token": "xxxx"}' \
    http://localhost:3000/login
 */

router.post('/login', async (req, res) => {
    // TODO: use proper validation
    const { api_key: token } = req.body;
    const session = await login(token);
    res.send({ access_token: session });
});

router.use('/individuals', individuals);

module.exports = router;
