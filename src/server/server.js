const express = require('express');
const app = express();
const cors = require('cors');
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
    let list = []
    let i = {}
    database.colaboradores.forEach((col) => {
        i = {...col}
        i.gastos = custoColaborador(col.matricula)
        list.push(i)
    })
    res.send(list)
})

app.post('/setPreco', function (req, res) {
    if (req.body.recurso === '' || req.body.tipo === '' || req.body.preco === '') {
        res.send('Dados incompletos!')
    } else {
        if (req.body.recurso === 'sala') {
            database[req.body.tipo] = req.body.preco
        } else {
            database[req.body.recurso].forEach((item) => {
                if (req.body.tipo === item.tipo) {
                    item.preco = req.body.preco
                }
            })
        }
        fs.writeFileSync('./src/server/database.json', JSON.stringify(database));
        res.send('true')
    }
})

app.get('/getQuantidade', function (req, res) {
    const listDatas = [];
    const dataF = moment(req.query.dataF, 'llll').format('DD-MM-YYYY');
    let data = moment(req.query.dataI, 'llll')

    if (verData(moment(req.query.dataI, 'llll').format('YYYY-MM-DD'), moment(req.query.dataF, 'llll')
        .format('YYYY-MM-DD'), req.query.recurso) !== '' || req.query.dataI === 'Invalid Date' || req.query.dataF === 'Invalid Date') {
        res.send('0')
    } else {

        while (data.format('DD-MM-YYYY') !== dataF) {
            listDatas.push(data.format('DD-MM-YYYY'))
            data = data.add(1, 'days');
        }
        listDatas.push(data.format('DD-MM-YYYY'))
        let ver = 0

        if (req.query.recurso === 'sala') {
            database.sala.forEach((item) => {
                if (item.tipo === req.query.tipo) {
                    ver = 1
                    item.reservas.forEach((reservas) => {
                        listDatas.forEach((data) => {
                            if (moment(data, 'DD-MM-YYYY').isBetween(moment(reservas.dataInicio, 'DD-MM-YYYY'),
                                moment(reservas.dataFim, 'DD-MM-YYYY'), undefined, '[]')) {
                                ver = 0
                            }
                        })
                    })
                }
            })
        } else {
            database[req.query.recurso].forEach((item) => {
                if (item.tipo === req.query.tipo) {
                    ver = parseInt(item.quantidade)
                    listDatas.forEach((data) => {
                        let somaItens = 0;
                        item.reservas.forEach((reservas) => {
                            if (moment(data, 'DD-MM-YYYY').isBetween(moment(reservas.dataInicio, 'DD-MM-YYYY'),
                                moment(reservas.dataFim, 'DD-MM-YYYY'), undefined, '[]')) {
                                somaItens += parseInt(reservas.quantidade)
                            }
                        })
                        if (parseInt(item.quantidade) - somaItens < ver) {
                            ver = parseInt(item.quantidade) - somaItens
                        }
                    })
                }
            })
        }
        res.send(ver + '')
    }
})

app.get('/somaRecursos', function (req, res) {
    let total = 0
    let obj = {}
    database.sala.forEach((item) => {
        item.reservas.forEach((res) => {
            total += res.preco
        })
    })
    obj.sala = total
    total = 0
    database.equipamento.forEach((item) => {
        item.reservas.forEach((res) => {
            total += res.preco
        })
    })
    obj.equipamento = total
    total = 0
    database.mobilia.forEach((item) => {
        item.reservas.forEach((res) => {
            total += res.preco
        })
    })
    obj.mobilia = total
    res.send(obj)
})

function custoColaborador(matricula) {
    let total = 0
    database.sala.forEach((sala) => {
        sala.reservas.forEach((item) => {
            if (item.matricula === matricula) {
                total += item.preco
            }
        })
    })

    database.mobilia.forEach((mobilia) => {
        mobilia.reservas.forEach((item) => {
            if (item.matricula === matricula) {
                total += item.preco
            }
        })
    })

    database.equipamento.forEach((equip) => {
        equip.reservas.forEach((item) => {
            if (item.matricula === matricula) {
                total += item.preco
            }
        })
    })
    return total
}

app.delete('/deleteReserva', function (req, res) {
    let obj = req.body.obj
    let db = database
    db[obj.recurso].forEach((rec) => {
        if (rec.tipo === obj.tipo) {
            rec.reservas.forEach((item) => {
                if (item.matricula === obj.matricula && item.dataFim === obj.dataFim &&
                    item.dataInicio === obj.dataInicio && item.preco === obj.preco && item.quantidade === obj.quantidade) {
                    var index = rec.reservas.indexOf(item);
                    if (index > -1) {
                        rec.reservas.splice(index, 1);
                        fs.writeFileSync('./src/server/database.json', JSON.stringify(db));
                    }
                }
            })
        }
    })
    res.send(true)
})

app.get('/getReservas', function (req, res) {
    let listRecursos = []
    database.sala.forEach((sala) => {
        sala.reservas.forEach((item) => {
            const i = {...item}
            i.nome = getNome(item.matricula)
            i.recurso = 'sala'
            i.tipo = sala.tipo
            listRecursos.push(i)
        })
    })

    database.mobilia.forEach((mobilia) => {
        mobilia.reservas.forEach((item) => {
            const i = {...item}
            i.nome = getNome(item.matricula)
            i.recurso = 'mobilia'
            i.tipo = mobilia.tipo
            listRecursos.push(i)
        })
    })

    database.equipamento.forEach((equip) => {
        equip.reservas.forEach((item) => {
            const i = {...item}
            i.nome = getNome(item.matricula)
            i.recurso = 'equipamento'
            i.tipo = equip.tipo
            listRecursos.push(i)
        })
    })
    res.send(listRecursos)
})

function getNome(matricula) {
    for (let col of database.colaboradores) {
        if (col.matricula === matricula) {
            return col.nome
        }
    }
}

app.get('/getPrecoGlobal', function (req, res) {
    const obj = {}
    obj.assento = database.assento
    obj.m2 = database.m2
    res.send(obj)
})

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
    console.log(req.body.dataI)
    if (req.body.dataI === null || req.body.dataF === null) {
        res.send('Data inválida!')
    } else {
        if (req.body.recurso === '' || req.body.tipo === '' || req.body.matricula === '' || req.body.preco === '' ||
            req.body.quantidade === '' || (req.body.quantidade === '0' && req.body.recurso !== 'sala')) {
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
    }
})

function isDisponivel(req) {
    const recurso = req.body.recurso
    const tipo = req.body.tipo
    const listDatas = [];
    const dataF = moment(req.body.dataF, 'YYYY-MM-DD').format('DD-MM-YYYY');
    const dataI = moment(req.body.dataI, 'YYYY-MM-DD').format('DD-MM-YYYY');
    console.log(moment().add(4, 'days'))
    console.log(moment(req.body.dataF, 'YYYY-MM-DD'))

    if (verData(dataI, dataF, recurso) !== '') {
        return verData(dataI, dataF, recurso)
    }

    let data = moment(req.body.dataI, 'YYYY-MM-DD');
    const db = database;
    //cria lista com todas as datas em que estara alugado
    while (data.format('DD-MM-YYYY') !== dataF) {
        listDatas.push(data.format('DD-MM-YYYY'))
        data = data.add(1, 'days');
    }
    listDatas.push(data.format('DD-MM-YYYY'))

    let disponivel = 'true'
    if (recurso === 'sala') {
        db.sala.forEach((item) => {
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
                        "quantidade": req.body.quantidade
                    })
                    fs.writeFileSync('./src/server/database.json', JSON.stringify(db));
                }
            }
        })
    } else {
        db[recurso].forEach((item) => {
            if (item.tipo === tipo) {
                listDatas.forEach((data) => {
                    let somaItens = 0;
                    item.reservas.forEach((reservas) => {
                        if (moment(data, 'DD-MM-YYYY').isBetween(moment(reservas.dataInicio, 'DD-MM-YYYY'),
                            moment(reservas.dataFim, 'DD-MM-YYYY'), undefined, '[]')) {
                            somaItens += parseInt(reservas.quantidade)
                        }
                    })
                    if (somaItens + parseInt(req.body.quantidade) > parseInt(item.quantidade)) {
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
                    fs.writeFileSync('./src/server/database.json', JSON.stringify(db));
                }
            }
        })
    }
    return disponivel
}

function verData(dataI, dataF, recurso) {
    if (moment().isAfter(moment(dataI, 'YYYY-MM-DD'), 'day')) {
        return 'Data inicial inválida!'
    }
    if (recurso === 'mobilia') {
        if (moment().add(4, 'days').isAfter(moment(dataF, 'YYYY-MM-DD'), 'day')) {
            return 'Data final inválida!'
        }
    } else {
        if (moment().isAfter(moment(dataF, 'YYYY-MM-DD'), 'day')) {
            return 'Data final inválida!'
        }
    }
    return ''
}

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
