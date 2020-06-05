const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser')
app.use(bodyParser.json())
const fs = require('fs');
const database = require('./database.json')

app.get('/getColaboradores', function (req, res) {
    const colaboradores = database.colaboradores
    res.send(colaboradores)
})

app.get('/getSalas', function (req, res) {
    const salas = database.sala
    res.send(salas)
})

app.get('/getMobilias', function (req, res) {
    const mobilia = database.mobilia
    res.send(mobilia)
})

app.get('/getEquipamentos', function (req, res) {
    const equipamento = database.equipamento
    res.send(equipamento)
})

app.post('/isAvaiable', function (req, res) {
    const recurso = req.body.recurso
    const thistipo = req.body.tipo
    req.body.dataInicio
    req.body.dataFim
    req.body.quantidade
    database[recurso].forEach(tipo => {
        if(tipo.tipo===thistipo){
            var somaItens=0
            tipo.reservas.forEach(reservas => {
                somaItens += parseInt(reservas.quantidade)
            })
    }}
    )


    res.send(database[recurso])
})


app.post('/', function (req, res) {
    res.send(req.body.nome)
});

const colaboradores = () =>{
    fs.readFile('./src/server/database.json', (err, data) => {
        if (err) throw err;
        let db = JSON.parse(data);

        console.log(db);
    });
}

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);