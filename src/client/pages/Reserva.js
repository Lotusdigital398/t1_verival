import 'date-fns';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './css/Reserva.css'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

class Reserva extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataI: new Date(),
            dataF: new Date(),
            recurso: "",
            matricula: "",
            tipo: '',
            quantidade: "",
            precoM2: "10",
            precoAssento: '5',
            precoTotal: 0,
            diferencaTempo: 1,
            recursos: [],
            tipos: [],
            quantDisp: '0',
            modal: false,
            regexp: /^[0-9\b]+$/
        }

        this.handleDataI = this.handleDataI.bind(this)
        this.handleDataF = this.handleDataF.bind(this)
        this.handleRec = this.handleRec.bind(this)
        this.handleTipo = this.handleTipo.bind(this)
        this.handleMat = this.handleMat.bind(this)
        this.handleQuant = this.handleQuant.bind(this)
        this.setReserva = this.setReserva.bind(this)
        this.calculaPreco = this.calculaPreco.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    componentDidMount() {
        this.getRecursos();
        this.getTipos();
        this.getGlobal();
    }

    getGlobal() {
        fetch('http://localhost:5000/getPrecoGlobal', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.text()).then(res => {
            const obj = JSON.parse(res)
            this.setState({precoM2: obj.m2, precoAssento: obj.assento})
        })
    }

    getRecursos() {
        fetch('http://localhost:5000/getRecursos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.text()).then(res => {
            this.setState({recursos: JSON.parse(res)})
        })
    }

    getTipos(recurso) {
        fetch(`http://localhost:5000/getTipos?recurso=${recurso ? recurso : this.state.recurso}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.text()).then(res => {
            if (res === 'false') {
                this.setState({tipos: []})
            } else {
                this.setState({tipos: JSON.parse(res)})
            }
        })
    }

    getQuantidade(t, i, f) {
        if (this.state.tipo !== '' || t) {
            fetch(`http://localhost:5000/getQuantidade?recurso=${this.state.recurso}&tipo=${t ? t : this.state.tipo}&dataI=${i ? i : this.state.dataI}&dataF=${f ? new Date(f.getTime()) : this.state.dataF}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.text()).then(res => {
                this.setState({quantDisp: res})
            })
        }
    }

    setReserva() {
        fetch('http://localhost:5000/setReserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'dataI': this.state.dataI,
                'dataF': this.state.dataF,
                'recurso': this.state.recurso,
                'tipo': this.state.tipo,
                'matricula': this.state.matricula,
                'quantidade': this.state.quantidade,
                'preco': this.state.precoTotal
            })
        }).then(res => res.text()).then(res => {
            if (res === "true") {
                this.setState({
                    dataI: new Date(),
                    dataF: new Date(),
                    recurso: '',
                    matricula: '',
                    tipo: '',
                    quantidade: '',
                    precoTotal: 0,
                    quantDisp: '0',
                    header: 'Sucesso!',
                    message: 'Sua reserva foi efetuada com sucesso!'
                })
                this.toggle()
            } else {
                this.setState({
                    header: 'Erro!',
                    message: res
                })
                this.toggle()
            }
        })
    }

    handleDataI(event) {
        let fim = this.state.dataF
        this.setState({dataI: event})
        let dif;
        if (this.state.recurso === "mobilia" && this.state.dataF.getTime() < (event.getTime() + 4 * 86400000)) {
            this.setState({dataF: new Date(event.getTime() + 4 * 86400000)})
            fim = event.getTime() + 4 * 86400000
            dif = Math.ceil(((event.getTime() + 4 * 86400000) - event.getTime()) / (86400000)) + 1;
        } else {
            if (this.state.dataF < event.getTime()) {
                this.setState({dataF: event})
                fim = event
                dif = Math.ceil((event.getTime() - event.getTime()) / (86400000)) + 1;
            } else {
                dif = Math.ceil((this.state.dataF.getTime() - event.getTime()) / (86400000)) + 1;
            }
        }
        this.setState({diferencaTempo: dif});
        this.calculaPreco(this.state.tipo, undefined, dif)
        this.getQuantidade(undefined, event, new Date(fim))
    }

    handleDataF(event) {
        this.setState({dataF: event})
        const dif = Math.ceil((event.getTime() - this.state.dataI.getTime()) / (86400000)) + 1;
        this.setState({diferencaTempo: dif});
        if (this.state.tipo !== '') {
            if (this.state.recurso !== '') {
                this.calculaPreco(this.state.tipo, undefined, dif)
            }
        }
        this.getQuantidade(undefined, undefined, event)
    }

    handleRec(event) {
        this.setState({recurso: event.target.value, quantDisp: '0'})
        this.setState({tipo: ""})
        this.setState({quantidade: ""})
        this.getTipos(event.target.value)
        if (event.target.value === "mobilia" && this.state.dataF.getTime() < (this.state.dataI.getTime() + 4 * 86400000)) {
            this.setState({dataF: new Date(this.state.dataI.getTime() + 4 * 86400000)})
        }
    }

    handleTipo(event) {
        this.setState({tipo: event.target.value})
        this.calculaPreco(event.target.value);
        this.getQuantidade(event.target.value)
    }


    handleMat(event) {
        this.setState({matricula: event.target.value})
    }

    handleQuant(event) {
        if (event.target.value === '' || this.state.regexp.test(event.target.value)) {
            this.setState({quantidade: event.target.value})
            this.calculaPreco(this.state.tipo, event.target.value === '' ? '0' : event.target.value);
        }
    }

    formatMoney(number) {
        number = isNaN(number) ? 0 : number
        return number.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }

    calculaPreco(event, quant, dif) {
        const quantidade = quant ? quant : this.state.quantidade;
        const diferenca = dif ? dif : this.state.diferencaTempo;
        let aux = 0;
        this.state.tipos.every(function (element, index) {
            if (element.tipo === event) {
                aux = index;
                return false;
            } else {
                return true;
            }
        })
        if (this.state.tipos[aux]) {
            if (this.state.recurso === "sala") {
                this.setState({precoTotal: this.state.precoM2 * this.state.tipos[aux].m2 * diferenca + (quantidade * this.state.precoAssento)})
            } else {
                this.setState({precoTotal: this.state.tipos[aux].preco * quantidade * diferenca})
            }
        }
    }

    toggle() {
        this.setState({modal: !this.state.modal});
    }

    render() {
        const theme = createMuiTheme({
            palette: {type: "dark"}
        });
        return (
            <ThemeProvider theme={theme}>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader>{this.state.header}</ModalHeader>
                    <ModalBody>
                        {this.state.message}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Fechar</Button>
                    </ModalFooter>
                </Modal>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid>
                        <br/>
                        <h3 align="center" style={{color: 'white'}}>Preço da Reserva:</h3>
                        <h3 align="center" style={{color: 'green'}}>{this.formatMoney(this.state.precoTotal)}</h3>
                        <h3 align="center" style={{color: 'white'}}>Quantidade disponível:</h3>
                        <h3 align="center" style={{color: 'purple'}}>{this.state.quantDisp}</h3>

                        <KeyboardDatePicker
                            className="drop1"
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="dataIId"
                            label="Data inicial"
                            minDate={new Date()}
                            value={this.state.dataI}
                            onChange={this.handleDataI}
                        />

                        {this.state.recurso === "mobilia" ?
                            <KeyboardDatePicker
                                className="drop2"
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="dataFId"
                                label="Data final"
                                minDate={this.state.dataI.getTime() + 4 * 86400000}
                                value={this.state.dataF}
                                onChange={this.handleDataF}
                            />
                            :
                            <KeyboardDatePicker
                                className="drop2"
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="dataFId"
                                label="Data final"
                                minDate={this.state.dataI}
                                value={this.state.dataF}
                                onChange={this.handleDataF}
                            />
                        }

                        <form className="matricula">
                            <TextField
                                id="matricula-Id"
                                label="Matrícula"
                                variant="outlined"
                                value={this.state.matricula}
                                onChange={this.handleMat}


                            />
                        </form>

                        <div>
                            <FormControl className="recursos" variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Recurso</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="Recurso"
                                    value={this.state.recurso}
                                    onChange={this.handleRec}
                                    style={{textTransform: 'capitalize'}}
                                >
                                    {this.state.recursos.map((item) => {
                                        return (
                                            <MenuItem style={{textTransform: 'capitalize'}} key={item}
                                                      value={item}>{item === 'sala' ? 'espaço físico' : item}</MenuItem>
                                        )
                                    })}

                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <FormControl className="tipo" variant="outlined">
                                {this.state.recurso === "sala" ?
                                    <InputLabel id="demo-simple-select-outlined-label">Número</InputLabel>
                                    :
                                    <InputLabel id="demo-simple-select-outlined-label">Tipo</InputLabel>
                                }

                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="Tipo"
                                    value={this.state.tipo}
                                    onChange={this.handleTipo}
                                    style={{textTransform: 'capitalize'}}
                                >
                                    {this.state.tipos.map((item) => {
                                        return (
                                            <MenuItem style={{textTransform: 'capitalize'}} key={item.tipo}
                                                      value={item.tipo}>{item.tipo}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </div>

                        {this.state.recurso !== "sala" ?
                            <form className="quantidade">
                                <TextField
                                    id="quantidade-Id"
                                    label="Quantidade do produto"
                                    variant="outlined"
                                    value={this.state.quantidade}
                                    onChange={this.handleQuant}
                                />
                            </form>
                            :
                            <form className="quantidade">
                                <TextField
                                    id="quantidade-Id"
                                    label="Quantidade de assentos"
                                    variant="outlined"
                                    value={this.state.quantidade}
                                    onChange={this.handleQuant}
                                />
                            </form>
                        }

                        <Button
                            className="bReserva"
                            variant="contained"
                            size="large"
                            startIcon={<SaveIcon/>}
                            onClick={this.setReserva}
                        >
                            Reservar
                        </Button>
                    </Grid>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        );
    }
}

export default Reserva;