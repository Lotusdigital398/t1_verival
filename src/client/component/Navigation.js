import React from "react";
import {NavLink} from 'react-router-dom';
import './Navigation.css'


// Botoes "globais" da aplicacao, podendo ser vistos em todas as paginas
const Navigation = () => {
    const navStyle = {
        color: 'white'
    };
    return (
        <nav>
            <h3>Logo</h3>


            <NavLink className="navList" to="/">
                <h3>Home</h3>
            </NavLink>

            <NavLink className="navList" to="/calendar">
                <h3>Calendar</h3>
            </NavLink>


        </nav>

    );
};

export default Navigation;