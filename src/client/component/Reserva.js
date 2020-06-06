import 'date-fns';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './Reserva.css'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,

} from '@material-ui/pickers';


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
            recursos: [],
            tipos: [],
            regexp: /^[0-9\b]+$/
        }
        this.handleDataI = this.handleDataI.bind(this)
        this.handleDataF = this.handleDataF.bind(this)
        this.handleRec = this.handleRec.bind(this)
        this.handleTipo = this.handleTipo.bind(this)
        this.handleMat = this.handleMat.bind(this)
        this.handleQuant = this.handleQuant.bind(this)
        this.setReserva = this.setReserva.bind(this)
    }


    componentDidMount() {
        this.getRecursos();
        this.getTipos();
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
                'quantidade': this.state.quantidade
            })
        }).then(res => res.text()).then(res => {
            if(res === "true"){
                window.alert("Sua reserva foi efetuada com sucesso!")
            } else{
                window.alert("Erro: " + res)
            }
        })
    }


    handleDataI(event) {
        this.setState({dataI: event})
        if (this.state.recurso === "mobilia" && this.state.dataF.getTime() < (event.getTime() + 4 * 86400000)) {
            this.state.dataF.setTime(event.getTime() + 4 * 86400000)
        }
    }

    handleDataF(event) {
        this.setState({dataF: event})

    }


    handleRec(event) {
        this.setState({recurso: event.target.value})
        this.setState({tipo: ""})
        this.setState({quantidade: ""})
        this.getTipos(event.target.value)
        if (event.target.value === "mobilia" && this.state.dataF.getTime() < (this.state.dataI.getTime() + 4 * 86400000)) {
            this.state.dataF.setTime(this.state.dataI.getTime() + 4 * 86400000)
        }

    }

    handleTipo(event) {
        this.setState({tipo: event.target.value})
    }


    handleMat(event) {
        this.setState({matricula: event.target.value})
    }


    handleQuant(event) {
        if (event.target.value === '' || this.state.regexp.test(event.target.value)) {
            this.setState({quantidade: event.target.value})
        }
    }


    render() {

        const theme = createMuiTheme({
            palette: {
                type: "dark"
            }
        });

        const today = new Date();
        return (
            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid>
                        <KeyboardDatePicker
                            className="drop1"
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="dataIId"
                            label="Date picker inline"
                            minDate={today}
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
                                label="Date picker inline"
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
                                label="Date picker inline"
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
                            <form></form>
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