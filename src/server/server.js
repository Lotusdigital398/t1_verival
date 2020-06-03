const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('<h1>Hello World!</h1>')
})

app.post('/', function (req, res) {
    res.send(req.body.nome)
});

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);