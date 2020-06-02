const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());

app.get('/', function (req, res) {
    res.send('<h1>Hello World!</h1>')
})

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);