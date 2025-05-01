/* COMPONENTE DE ELEMENTO DE INICIO DE SESIÓN */
import React, { useState } from 'react';
import axios from '../../api/axiosConfig'; // Importa la configuración personalizada
import '../css/login.css';

const LoginPanel = () => {
    const [nickname, setNickname] = useState('');
    const [psw, setPsw] = useState('');
    const [error, setError] = useState('');

    // URL del backend para hacer login
    const ipLogin = `http://${process.env.REACT_APP_HOST}/login/user`;

    // Función para manejar el submit del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario

        const body = {
            nickname,
            psw
        };

        try {
            const response = await axios.post(ipLogin, body);

            // Si el login es exitoso, redirigir según el tipo de usuario
            if (response.data.admin) {
                window.location.href = '/pansucursal';  // Redirigir a la página del administrador
            } else {
                window.location.href = '/sucursales';  // Redirigir a la página de sucursales
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
                console.error('Error durante el login:', error.response.data.error);
            }
        }
    };

    return (
        <div className="loginpanel">
            <h3>Iniciar Sesión</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nickname">Usuario:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        maxLength="50"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="psw">Contraseña:</label>
                    <input
                        type="password"
                        id="psw"
                        name="psw"
                        maxLength="50"
                        value={psw}
                        onChange={(e) => setPsw(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>} {/* Mostrar error si existe */}
                <button className="loginbutton" type="submit">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
};

export default LoginPanel;