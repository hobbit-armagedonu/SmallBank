const express = require('express');
const individuals = require('./lib/individuals');
const { login } = require('./lib/sessionService');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('checking the service state');
    res.send('Alive');
});

/**
 curl -X POST -H "Content-Type: application/json" -d '{"token": "xxxx"}' \
    http://localhost:3000/login
 */

router.post('/login', async (req, res) => {
    //TODO: use proper validation
    console.log(JSON.stringify(req.body));
    const { token } = req.body;
    const session = await login(token);
    res.send({ sessionId: session });
});

router.use('/individuals', individuals);

module.exports = router;
