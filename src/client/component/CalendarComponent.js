import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "../App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Instanciacao do localizer, library que gerencia o tempo
const localizer = momentLocalizer(moment);

// Instanciacao padrao de um calendario da library BigCalendar
class CalendarComponent extends Component {
    state = {
        events: [
            {
                start: moment().toDate(),
                end: moment()
                    .add(1, "days")
                    .toDate(),
                title: "Some title"
            }
        ]
    };

    render() {
        return (
            <div className="Calendar">
                <Calendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="month"
                    events={this.state.events}
                    style={{ height: "100vh" }}
                />
            </div>
        );
    }
}

export default CalendarComponent;