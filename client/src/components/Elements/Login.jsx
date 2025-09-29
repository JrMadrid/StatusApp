/* COMPONENTE DE ELEMENTO DE INICIO DE SESIÓN */
import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig'; // Importa la configuración personalizada
import '../css/login.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPanel = () => {
  const [nickname, setNickname] = useState('');
  const [psw, setPsw] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Verificar si ya tiene sesión activa
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const ipCheck = `http://${process.env.REACT_APP_HOST}/auth/check`;
        const response = await axios.get(ipCheck);

        // Si hay sesión activa, redirigir según el tipo de usuario
        if (response.data.admin) {
          window.location.href = '/pansucursal';
        } else {
          window.location.href = '/sucursales';
        }
      } catch (error) {
        // Si falla, no pasa nada, se queda en login
        console.log("No hay sesión activa");
      }
    };

    verificarSesion();
  }, []);

  // Leer y comprobar el usuario
  const iniciarSesion = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    const body = {
      nickname,
      psw
    };
    try {
      // URL del backend para hacer login
      const ipLogin = `http://${process.env.REACT_APP_HOST}/auth/login/user`;
      const response = await axios.post(ipLogin, body);

      // Si el login es exitoso, redirigir según el tipo de usuario
      if (response.data.admin) {
        window.location.href = '/pansucursal';  // Redirigir a la página del administrador
      } else {
        window.location.href = '/sucursales';  // Redirigir a la página de sucursales
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
        console.error('Error: // Leer y comprobar el usuario, ', error.response.data.message);
      }
    }
  };

  return (
    <div className="loginpanel">
      <h3>Iniciar Sesión</h3>
      <form onSubmit={iniciarSesion}>
        <div className="form-group">
          <label htmlFor="nickname" className='labellogin'>Usuario</label>
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
        <div className="form-group" style={{ position: "relative" }}>
          <label htmlFor="psw" className='labellogin'>Contraseña</label>

          {/* Botón para mostrar/ocultar */}
          <span onClick={() => setShowPassword(!showPassword)} className='ojo' >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          <input
            type={showPassword ? "text" : "password"}
            id="psw"
            name="psw"
            maxLength="50"
            value={psw}
            onChange={(e) => setPsw(e.target.value)}
            required
          />
        </div>
        <button className="loginbutton" type="submit">
          Iniciar Sesión
        </button>
        {error && <div className="error">{error}</div>} {/* Mostrar error si existe */}
      </form>
    </div>
  );
};

export default LoginPanel;