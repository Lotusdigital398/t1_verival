import React, {Component} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import './css/Calendar.css'
import './css/Modal.css'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
// Instanciacao do localizer, library que gerencia o tempo
const localizer = momentLocalizer(moment);

// Instanciacao padrao de um calendario da library BigCalendar
class CalendarComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            reservas: {},
            modal: false,
            title: '',
            obj: {}
        };

        this.toggle = this.toggle.bind(this);
        this.newEvent = this.newEvent.bind(this)
        this.getReservas = this.getReservas.bind(this)
        this.test = this.test.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    componentDidMount() {
        this.getReservas();
    }

    getReservas() {
        fetch('http://localhost:5000/getReservas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.text()).then(res => {
            this.setState({event: JSON.parse(res)})
            JSON.parse(res).forEach(item => {
                this.newEvent(item);
            })
        })
    }

    newEvent(event) {
        let idList = this.state.events.map(a => a.id)
        let newId = Math.max(idList) + 1
        var msg = event.recurso === 'sala' ? "Quantidade de Assentos: " : "Quantidade: ";
        let tipo = event.tipo.charAt(0).toUpperCase() + event.tipo.slice(1)
        let rec = event.recurso.charAt(0).toUpperCase() + event.recurso.slice(1)
        let titulo = "Colaborador: " + event.nome + " (" + event.matricula + ") " + "\nReserva de " + rec + ": " + tipo + " " + msg + event.quantidade + " (" + parseInt(event.preco).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }) + ")";
        event.id = newId
        let hour = {
            id: newId,
            title: titulo,
            start: moment(event.dataInicio, 'DD-MM-YYYY').toDate(),
            end: moment(event.dataFim, 'DD-MM-YYYY').toDate(),
            obj: event
        }
        this.setState({
            events: this.state.events.concat([hour])
        })
    }

    onDelete() {
        fetch('http://localhost:5000/deleteReserva', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                obj: this.state.obj
            })
        }).then(res => res.text()).then(res => {
            if (res === 'true') {
                this.setState((prevState) => {
                    const events = [...prevState.events]
                    let idx = 0;
                    console.log(events)
                    for (const [index, value] of events.entries()) {
                        if (value.obj.id === this.state.obj.id) {
                            idx = index
                            break
                        }
                    }
                    events.splice(idx, 1);
                    return {events};
                });
                this.setState({modal: !this.state.modal, obj: {}})
                console.log(res)
            } else {
                console.log('erro')
            }
        })
    }

    test(event) {
        this.toggle(event)
    }

    toggle(event) {
        this.setState({
            obj: this.state.modal ? this.state.obj :event.obj,
            modal: !this.state.modal,
            title: event.title
        });
    }

    render() {
        return (
            <div className="Calendar">
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody style={{textTransform: 'capitalize'}}>

                        Nome: {this.state.obj ? this.state.obj.nome : ''}<br/>
                        Matricula: {this.state.obj ? this.state.obj.matricula : ''}<br/>
                        Recurso: {this.state.obj ? this.state.obj.recurso : ''}<br/>
                        Tipo: {this.state.obj ? this.state.obj.tipo : ''}<br/>
                        Quantidade: {this.state.obj ? this.state.obj.quantidade : ''}<br/>
                        Preço: {this.state.obj && this.state.obj.preco ? this.state.obj.preco.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : ''}
                    </ModalBody>
                    <ModalFooter>
                        {this.state.obj && moment().isAfter(moment(this.state.obj.dataInicio, 'DD-MM-YYYY')) ? <br/> :
                            <Button color="primary" onClick={this.onDelete}>Excluir</Button>}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Calendar
                    views={['month', 'agenda']}
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="month"
                    events={this.state.events}
                    style={{height: "100vh"}}
                    onSelectEvent={this.test}
                />
            </div>
        );
    }
}

export default CalendarComponent;