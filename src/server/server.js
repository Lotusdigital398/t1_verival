const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.get('/', function (req, res) {
    res.send('<h1>Hello World!</h1>')
})

app.post('/', function (req, res) {
    console.log(req.body.nome)
});

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);