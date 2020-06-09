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
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recurso: "",
            tipo: '',
            quantidade: "",
            preco: '',
            precoAtual: '0',
            precoM2: '',
            precoAssento: '',
            recursos: [],
            tipos: [],
            modal: false,
            regexp: /^[0-9\b]+$/
        }

        this.handlePrecoAtual = this.handlePrecoAtual.bind(this)
        this.handleRec = this.handleRec.bind(this)
        this.handleTipo = this.handleTipo.bind(this)
        this.handlePreco = this.handlePreco.bind(this)
        this.toggle = this.toggle.bind(this)
        this.setPreco = this.setPreco.bind(this)

    }

    componentDidMount() {
        this.getRecursos();
        this.getTipos();
        this.getGlobal();

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

    getTipos(recurso) {
        if ((recurso ? recurso : this.state.recurso) === 'sala') {
            this.setState({tipos: [{tipo: 'm2'}, {tipo: 'assento'}]})
        } else {
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
    }


    setPreco() {
        fetch('http://localhost:5000/setPreco', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'recurso': this.state.recurso,
                'tipo': this.state.tipo,
                'preco': this.state.preco
            })
        }).then(res => res.text()).then(res => {
            if (res === "true") {
                this.setState({
                    recurso: '',
                    tipo: '',
                    preco: '',
                    header: 'Sucesso!',
                    message: 'Preço alterado com sucesso!'
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


    handleRec(event) {
        this.setState({recurso: event.target.value, quantDisp: '0'})
        this.setState({tipo: ""})
        this.setState({quantidade: ""})
        this.getTipos(event.target.value)
    }

    handleTipo(event) {
        this.setState({tipo: event.target.value})
        this.handlePrecoAtual(event)
    }

    handlePreco(event) {
        if (event.target.value === '' || this.state.regexp.test(event.target.value)) {
            this.setState({preco: event.target.value})
        }
    }

    handlePrecoAtual(event) {
        if (event.target) {
            if (event.target.value === "m2") {
                this.setState({precoAtual: this.state.precoM2})
            } else if (event.target.value === "assento") {
                this.setState({precoAtual: this.state.precoAssento})
            } else {
                this.state.tipos.forEach(item => {
                    if (item.tipo === event.target.value) {
                        this.setState({precoAtual: item.preco})
                    }
                })
            }
        }
    }

    formatMoney(number) {
        return parseInt(number).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
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
                    <ModalHeader toggle={this.toggle}>{this.state.header}</ModalHeader>
                    <ModalBody>
                        {this.state.message}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Fechar</Button>
                    </ModalFooter>
                </Modal>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid>
                        <h3 align="center" style={{color: 'white'}}>Preço Atual</h3>
                        <h3 align="center" style={{color: 'green'}}>{this.formatMoney(this.state.precoAtual)}</h3>
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
                                                      value={item}>{item}</MenuItem>
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
                        <form className="quantidade">
                            <TextField
                                //^^^^^^^^^^^^^^^^^^MUDAR AQUI O CLASSNAME PRA QUANTIDADE CARLOS
                                id="preco-Id"
                                label="Preço"
                                variant="outlined"
                                value={this.state.preco}
                                onChange={this.handlePreco}
                            />
                        </form>


                        <Button
                            className="bReserva"
                            variant="contained"
                            size="large"
                            startIcon={<SaveIcon/>}
                            onClick={this.setPreco}
                        >
                            Aplicar
                        </Button>
                    </Grid>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        );
    }
}

export default Admin;