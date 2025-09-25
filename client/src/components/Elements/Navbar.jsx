/* COMPONENTE DE ELEMENTO DE BARRA DE NAVEGACIÓN */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { NavLink } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import fetchData from '../../api/fetchConfig.js';
import { FaAddressCard } from "react-icons/fa";
import '../css/navbar.css';

/* Definir navbar según el tipo usuario */
export default function Navbar() {
  const user = useContext(UserContext);

  function capitalizartexto(text) { // Poner en mayuscula la primera letra de cada palabra
    const capitalizado = text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return capitalizado;
  }

  /* Función para cerrar sesión */
  const Logout = async () => {
    return toast.promise(
      fetchData(`http://${process.env.REACT_APP_HOST}/auth/out`).then(async (response) => {
        if (!response.ok) {
          throw new Error('Sin respuesta');
        }
        return response.json();
      }),
      {
        loading: 'Cerrando Sesión...',
        success: (cierre) => {
          if (cierre) {
            window.location.href = '/'; // Redirigir a la página de inicio
            return <b style={{ color: 'green', fontSize: '20px' }}>Sesión cerrada</b>;
          }
          else {
            return <b style={{ color: 'red', fontSize: '20px' }}>Error al cerrar sesión</b>;
          }
        },
        error: () => {
        },
      },
      {
        style: { Width: '250px', Height: '25px', },
        success: { duration: 2500, icon: null, },
      }
    );
  };

  return (
    <>
      <div className='navbar'>
        {/* SIN USUARIO - INICIO DE SESIÓN */}
        {user && user.id === 0 && (
          <>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to='/'>
                Iniciar Sesión
              </NavLink>
            </li>
          </>
        )}

        {/* CON USUARIO - SESIÓN INICIADA*/}
        {user && user.id !== 0 && (
          <>
            <li className='usuario'>
              {capitalizartexto(user.username)}
            </li>
          </>
        )}

        {/* ADMINISTRADOR, APLICATIVO & GEOGRAFIA */}
        {user && (user.id === 2 || user.id === 3 || user.id === 4) && (
          <li style={{ paddingBottom: '0rem', paddingTop: '0.3rem' }} >
            <NavLink className={({ isActive }) => (isActive ? "active" : "")} style={{ fontSize: '1rem' }} to="/users">
              <FaAddressCard />
            </NavLink>
          </li>
        )}

        {/* SUPER ADMINISTRADOR & ADMINISTRADOR */}
        {user && (user.id === 1 || user.id === 2) && (
          <>
            {/* SUPER ADMINISTRADOR */}
            {user && user.id === 1 && (
              <li>
                <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panusers">
                  Usuarios
                </NavLink>
              </li>
            )}
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/pansucursal">
                Sucursales
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panapps">
                Dispositivos
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panmantenimiento">
                Mantenimientos
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panmanuales">
                Manuales
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/paninformes">
                Informes
              </NavLink>
            </li>
            <li className='tipo'>
              {user.tipo}
            </li>
          </>
        )}

        {/* APLICATIVO & GEOGRAFIA */}
        {user && (user.id === 3 || user.id === 4) && (
          <>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/sucursales">
                Sucursales
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/dispositivos">
                Dispositivos
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/mantenimientos">
                Mantenimientos
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/panmanuales">
                Manuales
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/paninformes">
                Informes
              </NavLink>
            </li>
            <li className='tipo'>
              {user.tipo}
            </li>
          </>
        )}

        {/* TODOS - FIN DE SESIÓN */}
        {user && user.id !== 0 && (
          <>
            <li className='close'>
              <NavLink onClick={Logout} style={{ color: 'whitesmoke' }}>
                Cerrar Sesión
              </NavLink>
            </li>
          </>
        )}
      </div>
      <Toaster toastOptions={{ className: 'noti' }} />
    </>
  );
};