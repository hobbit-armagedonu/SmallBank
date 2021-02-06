const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('checking the service state');
    res.send('Alive');
});

module.exports = router;
