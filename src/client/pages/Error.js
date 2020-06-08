import React from 'react';

// Pagina de erro quando um usuario tenta acessar algo que nao existe
const Error = () => {
    return (
        <div>
            <h1 style={{color: 'red'}}>404</h1>
            <br/>
            <h1 align={'center'} style={{color: 'grey'}}>Bah, mas tu foi longe, não existe nada aqui!</h1>
        </div>
    );
};

export default Error;