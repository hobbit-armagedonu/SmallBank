const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
    res.send('TODO');
});

router.get('/', (req, res) => {
    res.send('TODO');
});

router.get('/:id', (req, res) => {
    res.send('TODO');
});

router.get('/:id/limits', (req, res) => {
    res.send('TODO');
});

router.post('/:id/onboard', (req, res) => {
    res.send('TODO');
});

module.exports = router;
