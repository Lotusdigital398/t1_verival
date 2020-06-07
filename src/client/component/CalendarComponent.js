import React, {Component} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import Modal from '@material-ui/core/Modal';



import './css/Calendar.css'


// Instanciacao do localizer, library que gerencia o tempo
const localizer = momentLocalizer(moment);

// Instanciacao padrao de um calendario da library BigCalendar
class CalendarComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            reservas: {},
            open: false
        }
        this.newEvent = this.newEvent.bind(this)
        this.getReservas = this.getReservas.bind(this)
        this.test = this.test.bind(this)
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
        let newId = Math.max(...idList) + 1
        var msg = event.recurso === 'sala' ? "Quantidade de Assentos: " : "Quantidade: ";
        let tipo = event.tipo.charAt(0).toUpperCase() + event.tipo.slice(1)
        let rec = event.recurso.charAt(0).toUpperCase() + event.recurso.slice(1)
        let titulo = "Colaborador: " + event.nome + " (" + event.matricula + ") " + "Reserva de " + rec + ": " + tipo + " " + msg + event.quantidade + " (" + parseInt(event.preco).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }) + ")";
        let hour = {
            id: newId,
            title: titulo,
            start: moment(event.dataInicio, 'DD-MM-YYYY').toDate(),
            end: moment(event.dataFim, 'DD-MM-YYYY').toDate(),
        }
        this.setState({
            events: this.state.events.concat([hour]),
        })
    }

    test(event) {
        console.log("SAUIHHUDSA")
        this.handleOpen()
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    render() {
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div >
                    <h2>Simple React Modal</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi accumsan odio enim, non pharetra est ultrices et.
                    </p>
                </div>
            </Modal>,
            <div className="Calendar">
                <Calendar
                    popup
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