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
            colaboradores: []
        }
    }


    componentDidMount() {
        this.getColaboradores();
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

    render() {
        return (
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
                                <TableCell align="center">{row.gastos}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

}

export default Colaboradores;