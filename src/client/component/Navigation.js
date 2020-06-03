import React from "react";
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/calendar">Calendar</NavLink>
        </div>
    );
};

export default Navigation;