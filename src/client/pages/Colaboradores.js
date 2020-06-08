import React, {Component} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Calendar} from "react-big-calendar";


class Colaboradores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colaboradores: []
        }
        //this.handleDataI = this.handleDataI.bind(this)

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
            <div>
               <h3>LISTA DE COLABORADORES: </h3>
            </div>
        );
    }

}

export default Colaboradores;