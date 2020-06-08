import React from "react";
import {NavLink} from 'react-router-dom';
import './css/Navigation.css'


// Botoes "globais" da aplicacao, podendo ser vistos em todas as paginas
const Navigation = () => {

    return (
        <nav>



            <NavLink className="navList" to="/">
                <h3>Home</h3>
            </NavLink>

            <NavLink className="navList" to="/colaboradores">
                <h3>Colaboradores</h3>
            </NavLink>

            <NavLink className="navList" to="/reserva">
                <h3>Reserva</h3>
            </NavLink>

            <NavLink className="navList" to="/calendar">
                <h3>Calendar</h3>
            </NavLink>



        </nav>

    );
};

export default Navigation;