import React from "react";
import { NavLink } from 'react-router-dom';


// Botoes "globais" da aplicacao, podendo ser vistos em todas as paginas
const Navigation = () => {
    return (
        <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/calendar">Calendar</NavLink>
        </div>
    );
};

export default Navigation;