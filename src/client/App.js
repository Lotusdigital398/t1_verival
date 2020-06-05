// Imports do React Router, etc
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Imports de Components
// Vale notar que para o React Router, cada componente se trata de uma pagina
import Home from "./component/Home";
import Reserva from "./component/Reserva";
import CalendarComponent from "./component/CalendarComponent";
import Error from "./component/Error";
import Navigation from "./component/Navigation";


// Instanciacao das paginas disponiveis a serem acessadas na aplicacao
class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Navigation />
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/calendar" component={CalendarComponent} />
                        <Route path="/reserva" component={Reserva} />
                        <Route component={Error} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
};

export default App;