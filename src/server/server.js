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

app.get('/getColaboradores', function (req, res) {
    res.send(database.colaboradores)
})

app.get('/getReservas', function (req, res) {
    let listRecursos = []
    database.sala.forEach((sala) => {
        sala.reservas.forEach((item) => {
            item.nome = getNome(item.matricula)
            item.recurso = 'sala'
            item.tipo = sala.tipo
            item.quantidade += sala.assento
            listRecursos.push(item)
        })
    })

    database.mobilia.forEach((mobilia) => {
        mobilia.reservas.forEach((item) => {
            item.nome = getNome(item.matricula)
            item.recurso = 'mobilia'
            item.tipo = mobilia.tipo
            listRecursos.push(item)
        })
    })

    database.equipamento.forEach((equip) => {
        equip.reservas.forEach((item) => {
            item.nome = getNome(item.matricula)
            item.recurso = 'equip'
            item.tipo = equip.tipo
            listRecursos.push(item)
        })
    })
    res.send(listRecursos)
})

function getNome(matricula){
    for (let col of database.colaboradores) {
        if(col.matricula === matricula){
            return col.nome
        }
    }
}

app.get('/getTipos', function (req, res) {
    var list = []
    if (database[req.query.recurso]) {
        database[req.query.recurso].forEach((item) => {
            if (req.query.recurso === 'sala') {
                list.push({
                    'tipo': item.tipo,
                    'm2': item.m2,
                    'assento': item.assento
                })
            } else {
                list.push({
                    'tipo': item.tipo,
                    'preco': item.preco
                })
            }
        })
        res.send(list)
    } else {
        res.send(false)
    }
})

app.post('/setReserva', function (req, res) {
    if (req.body.recurso === '' || req.body.tipo === '' || req.body.matricula === '' || req.body.preco === '' || (req.body.quantidade === '' && req.body.recurso !== 'sala')) {
        res.send('Dados incompletos!')
    } else {
        let matriculaVal = false;
        database.colaboradores.forEach((item) => {
            if (item.matricula === req.body.matricula) {
                matriculaVal = true
            }
        })
        if (matriculaVal) {
            res.send(isDisponivel(req))
        } else {
            res.send('Matrícula inválida!')
        }
    }
})

function isDisponivel(req) {
    const recurso = req.body.recurso
    const tipo = req.body.tipo
    var listDatas = []
    var dataF = moment(req.body.dataF, 'YYYY-MM-DD').format('DD-MM-YYYY')
    var dataI = moment(req.body.dataI, 'YYYY-MM-DD').format('DD-MM-YYYY')
    var data = moment(req.body.dataI, 'YYYY-MM-DD')
    //cria lista com todas as datas em que estara alugado
    while (data.format('DD-MM-YYYY') !== dataF) {
        listDatas.push(data.format('DD-MM-YYYY'))
        data = data.add(1, 'days');
    }
    listDatas.push(data.format('DD-MM-YYYY'))

    //trata sala diferente de equipamento e mobilia
    var disponivel = 'true'
    if (recurso === 'sala') {
        database.sala.forEach((item) => {
            if (item.tipo === tipo) {
                item.reservas.forEach((reservas) => {
                    listDatas.forEach((data) => {
                        if (moment(data, 'DD-MM-YYYY').isBetween(moment(reservas.dataInicio, 'DD-MM-YYYY'),
                            moment(reservas.dataFim, 'DD-MM-YYYY'), undefined, '[]')) {
                            disponivel = 'Sala indisponível na data selecionada!'
                        }
                    })
                })
                if (disponivel === 'true') {
                    item.reservas.push({
                        "matricula": req.body.matricula,
                        "dataInicio": dataI,
                        "dataFim": dataF,
                        "preco": req.body.preco,
                        "assento": req.body.quantidade
                    })
                    fs.writeFileSync('./src/server/database.json', JSON.stringify(database));
                }
            }
        })
    } else {
        database[recurso].forEach((item) => {
            if (item.tipo === tipo) {
                listDatas.forEach((data) => {
                    var somaItens = 0
                    item.reservas.forEach((reservas) => {
                        if (moment(data, 'DD-MM-YYYY').isBetween(moment(reservas.dataInicio, 'DD-MM-YYYY'),
                            moment(reservas.dataFim, 'DD-MM-YYYY'), undefined, '[]')) {
                            somaItens += parseInt(reservas.quantidade)
                        }
                    })
                    if (somaItens + parseInt(req.body.quantidade) > item.totais) {
                        disponivel = 'Quantidade de ' + recurso + ' não disponível na data selecionada!'
                    }
                })
                if (disponivel === 'true') {
                    item.reservas.push({
                        "matricula": req.body.matricula,
                        "dataInicio": dataI,
                        "dataFim": dataF,
                        "quantidade": req.body.quantidade,
                        "preco": req.body.preco
                    })
                    fs.writeFileSync('./src/server/database.json', JSON.stringify(database));
                }
            }
        })
    }
    console.log(disponivel)
    return disponivel
}

moment.createFromInputFallback = function (config) {
    // unreliable string magic, or
    config._d = new Date(config._i);
};

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
