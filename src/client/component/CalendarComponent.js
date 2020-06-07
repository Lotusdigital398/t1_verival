import React, {Component} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";

import './css/Calendar.css'


// Instanciacao do localizer, library que gerencia o tempo
const localizer = momentLocalizer(moment);

// Instanciacao padrao de um calendario da library BigCalendar
class CalendarComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            reservas: []
        }
        this.newEvent = this.newEvent.bind(this)
        this.getReservas = this.getReservas.bind(this)
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
            JSON.parse(res).forEach(item => {
                this.newEvent(item);
            })
        })
    }

    newEvent(event) {

        let idList = this.state.events.map(a => a.id)
        let newId = Math.max(...idList) + 1
        let tipo = event.tipo.charAt(0).toUpperCase() + event.tipo.slice(1)
        let titulo = "Colaborador: " +  event.nome + " (" + event.matricula + ") " + "Reserva: " + tipo + " (" + parseInt(event.preco).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) + ")";
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


    render() {
        return (
            <div className="Calendar">
                <Calendar
                    views={['month', 'agenda']}
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="month"
                    events={this.state.events}
                    style={{height: "100vh"}}
                />
            </div>
        );
    }
}

export default CalendarComponent;