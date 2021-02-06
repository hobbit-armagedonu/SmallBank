const express = require('express');
const individuals = require('./lib/individuals');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('checking the service state');
    res.send('Alive');
});

router.post('/login', (req, res) => {
    res.send('TODO');
});

router.use('/individuals', individuals);

module.exports = router;
