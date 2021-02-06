const express = require('express');
const routes = require('./routes');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Bank server running on port: ${PORT}`);
});
