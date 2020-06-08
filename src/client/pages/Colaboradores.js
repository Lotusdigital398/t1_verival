import React, {Component} from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Colaboradores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colaboradores: [],
            totalRecursos: {}
        }
    }

    componentDidMount() {
        this.getColaboradores()
        this.getTotalRecursos()
    }

    getTotalRecursos() {
        fetch('http://localhost:5000/somaRecursos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.text()).then(res => {
            this.setState({totalRecursos: JSON.parse(res)})
        })
    }

    getColaboradores() {
        fetch('http://localhost:5000/getColaboradores', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.text()).then(res => {
            this.setState({colaboradores: JSON.parse(res)})
        })
    }

    formatMoney(number) {
        return parseInt(number).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }

    render() {
        return (
            <div>
                <h2 align="center" style={{color: 'white'}}>Contribuintes:</h2>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nome do Contribuinte</TableCell>
                                <TableCell align="center">Matrícula</TableCell>
                                <TableCell align="center">E-Mail</TableCell>
                                <TableCell align="center">Gastos</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.colaboradores.map((row) => (
                                <TableRow key={row.matricula}>
                                    <TableCell align="center">{row.nome}</TableCell>
                                    <TableCell align="center">{row.matricula}</TableCell>
                                    <TableCell align="center">{row.email}</TableCell>
                                    <TableCell align="center">{this.formatMoney(row.gastos)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>,

                <h2 align="center" style={{color: 'white'}}>Total de gastos:</h2>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Salas</TableCell>
                                <TableCell align="center">Equipamento</TableCell>
                                <TableCell align="center">Mobilias</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                <TableRow>
                                    <TableCell align="center">{this.formatMoney(this.state.totalRecursos.sala)}</TableCell>
                                    <TableCell align="center">{this.formatMoney(this.state.totalRecursos.equipamento)}</TableCell>
                                    <TableCell align="center">{this.formatMoney(this.state.totalRecursos.mobilia)}</TableCell>
                                </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
        )
    }
}

export default Colaboradores;