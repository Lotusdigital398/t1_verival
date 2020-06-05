import 'date-fns';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './Reserva.css'


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,

} from '@material-ui/pickers';

class Reserva extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataI: "",
            dataF: "",
            recurso: "",
            matricula: "",
            tipo: "",
            quantidade: ""
        }
        this.handleDataI = this.handleDataI.bind(this)
        this.handleDataF = this.handleDataF.bind(this)
        this.handleRec = this.handleRec.bind(this)
        this.handleTipo = this.handleTipo.bind(this)
        this.handleMat = this.handleMat.bind(this)
        this.handleQuant = this.handleQuant.bind(this)
    }


    handleDataI(event) {
        console.log(event)
        this.setState({dataI: event})
    }

    handleDataF(event) {
        console.log(event)
        this.setState({dataF: event})
    }


    handleRec(event) {
        console.log(event.target)
        this.setState({recurso: event.target.value})
    }

    handleTipo(event) {
        console.log(event)
        this.setState({tipo: event.target.value})
    }


    handleMat(event) {
        console.log(event)
        this.setState({matricula: event.target.value})
    }


    handleQuant(event) {
        console.log(event)
        this.setState({quantidade: event.target.value})
    }


    render() {

        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                    <KeyboardDatePicker className="drop"
                                        disableToolbar
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        id="dataIId"
                                        label="Date picker inline"
                                        defaultValue= {new Date()}
                                        value={this.state.dataI}
                                        onChange={this.handleDataI}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                    />

                    <TextField
                        id="date"
                        label="Birthday"
                        type="date"
                        defaultValue="2017-05-24"
                        //value={this.state.dataI}
                        //onChange={this.handleDataI}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />


                    <KeyboardDatePicker
                        className="drop"
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="dataFId"
                        label="Date picker inline"
                        value={this.state.dataF}
                        onChange={this.handleDataF}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />

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
                            >
                                <MenuItem value="">
                                </MenuItem>
                                <MenuItem value={"Sala"}>Sala</MenuItem>
                                <MenuItem value={"Televisao"}>Televisao</MenuItem>
                                <MenuItem value={"Cadeira"}>Cadeira</MenuItem>
                            </Select>


                        </FormControl>
                    </div>


                    <div>
                        <FormControl className="tipo" variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Tipo</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                label="Tipo"
                                value={this.state.tipo}
                                onChange={this.handleTipo}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </div>


                    <form className="quantidade">
                        <TextField
                            id="quantidade-Id"
                            label="Quantidade"
                            variant="outlined"
                            value={this.state.quantidade}
                            onChange={this.handleQuant}
                        />
                    </form>


                </Grid>
            </MuiPickersUtilsProvider>
        );

    }
}

export default Reserva;