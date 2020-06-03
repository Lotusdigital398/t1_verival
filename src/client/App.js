import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import CalendarComponent from "./component/CalendarComponent";
import Home from "./component/Home";
import Error from "./component/Error";
import Navigation from "./component/Navigation";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Navigation />
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/calendar" component={CalendarComponent} />
                        <Route component={Error} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
};

export default App;