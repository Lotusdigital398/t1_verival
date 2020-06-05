const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser')
app.use(bodyParser.json())
const fs = require('fs');
const database = require('./database.json')
const moment = require('moment')


app.get('/getRecursos', function (req, res) {
    res.send(["sala", "mobilia", "equipamento"])
})

app.get('/getTipos', function (req, res) {
    var list = []
    if (database[req.query.recurso]) {
        database[req.query.recurso].forEach((item) => {
            list.push(item.tipo)
        })
        console.log(list)
        res.send(list)
    } else {
        console.log(false)
        res.send(false)
    }
})

app.post('/isDisponivel', function (req, res) {
    const recurso = req.body.recurso
    const tipo = req.body.tipo
    var listDatas = []
    var dataF = moment(req.body.dataFim, 'DD-MM-YYYY').format('DD-MM-YYYY')
    var data = moment(req.body.dataInicio, 'DD-MM-YYYY')

    //cria lista com todas as datas em que estara alugado
    while (data.format('DD-MM-YYYY') !== dataF) {
        listDatas.push(data.format('DD-MM-YYYY'))
        data = data.add(1, 'days');
    }
    listDatas.push(data.format('DD-MM-YYYY'))
    console.log(listDatas)

    //trata sala diferente de equipamento e mobilia
    var disponivel = true
    if (recurso === 'sala') {
        database.sala.forEach((item) => {
                if (item.numero === req.body.numero) {
                    item.reservas.forEach((reservas) => {
                        listDatas.forEach((data) => {
                            if (moment(data, 'DD-MM-YYYY').isBetween(moment(reservas.dataInicio, 'DD-MM-YYYY')
                                , moment(reservas.dataFim, 'DD-MM-YYYY'), undefined, '[]')) {
                                disponivel = false
                            }
                        })
                    })
                }
            }
        )
    } else {
        database[recurso].forEach((item) => {
                if (item.tipo === tipo) {
                    listDatas.forEach((data) => {
                        var somaItens = 0
                        item.reservas.forEach((reservas) => {
                            if (moment(data, 'DD-MM-YYYY').isBetween(moment(reservas.dataInicio, 'DD-MM-YYYY')
                                , moment(reservas.dataFim, 'DD-MM-YYYY'), undefined, '[]')) {
                                somaItens += parseInt(reservas.quantidade)
                            }
                        })
                        if (somaItens + parseInt(req.body.quantidade) > item.totais) {
                            disponivel = false
                        }
                    })
                }
            }
        )
    }
    res.send(disponivel)
})
app.post('/', function (req, res) {
    res.send(req.body.nome)
});


const colaboradores = () => {
    fs.readFile('./src/server/database.json', (err, data) => {
        if (err) throw err;
        let db = JSON.parse(data);

        console.log(db);
    });
}

moment.createFromInputFallback = function (config) {
    // unreliable string magic, or
    config._d = new Date(config._i);
};

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
