import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './Reserva.css'


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,

} from '@material-ui/pickers';


export default function Reserva() {
    // The first commit of Material-UI
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [recurso, setRecurso] = React.useState('');
    const [tipo, setTipo] = React.useState('');
    const [valor, setValor] = React.useState('');

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleChangeRecurso = (event) => {
        setRecurso(event.target.value);
    };

    const handleChangeTipo = (event) => {
        setTipo(event.target.value);
    };

    const handleChangeValor = (event) => {
        setValor(event.target.value);
    };


    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
                <KeyboardDatePicker className="drop"
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                <KeyboardDatePicker className="drop"
                    margin="normal"
                    id="date-picker-dialog"
                    label="Date picker dialog"
                    format="dd/MM/yyyy"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />

                <form className="matricula">
                    <TextField id="outlined-basic" label="Matrícula" variant="outlined"/>
                </form>


                <div>

                    <FormControl className="recursos" variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">Recurso</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            label="Recurso"
                            value={recurso}
                            onChange={handleChangeRecurso}
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


                <div>
                    <FormControl className="tipo" variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">Tipo</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            label="Tipo"
                            value={tipo}
                            onChange={handleChangeTipo}
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
                    <TextField id="outlined-basic" label="Quantidade" variant="outlined"/>
                </form>



            </Grid>
        </MuiPickersUtilsProvider>
    );
}