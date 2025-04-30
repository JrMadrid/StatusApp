/* PAGINA DE INICIO DE SESION */
import React from 'react';
import LoginPanel from '../components/Elements/Login.jsx';
import logo from '../imgs/LogoSoporte.png';
import './css/login.css';

const Iniciar = () => {
  return (
    <div className="home">
      <img src={logo} className="home-logo" alt="logo" />
      <LoginPanel />
    </div>
  );
};

export default Iniciar;