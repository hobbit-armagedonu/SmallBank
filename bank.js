const express = require('express');

const PORT = process.env.PORT || 8080;
app = express();

app.get('/', (req, res) => {
    console.log('checking the service state');
    res.send('Alive');
});

app.listen(PORT, () => {
    console.log(`Bank server running on port: ${PORT}`);
})