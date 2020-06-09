import React from "react";
import logo from './css/logoPUCRS.png';
import './css/Home.css';

//Commit 100

// Pagina principal da aplicacao
const Home = () => {
    return (
        <div className="Home">
            <h3 align="center" style={{color: 'white'}}>VERIFICAÇÃO E VALIDAÇÃO DE SOFTWARE</h3>
            <br/>
            <br/>
            <h3 className="Spin" align="center" style={{color: 'white'}}>Gabriel Castro</h3>
            <h3 className="Spin" align="center" style={{color: 'white'}}>Carlos Castro</h3>
            <h3 className="Spin" align="center" style={{color: 'white'}}>Lucas Schell</h3>
            <h3 className="Spin" align="center" style={{color: 'white'}}>Max Franke</h3>
            <h3 className="Spin" align="center" style={{color: 'white'}}>Frederico Thofehrn</h3>
            <br/>
            <br/>
            <br/>
            <header className="Home-header">
                <img src={logo} className="Home-logo" alt="logo" />
                <p>
                </p>
            </header>
        </div>
    );
}

export default Home;