/* COMPONENTE DE PANEL DE ADMINISTRACIÓN DE SUCURSALES */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PostSucursales from './PostSucursales';
import UpdateSucursales from './UpdateSucursales';
import DeleteSucursales from './DeleteSucursales';
import './../css/panel.css';

const SucursalesPanel = () => {
  const user = useContext(UserContext);

  return (
    <>
      {user && (user.id === 1 || user.id === 2) && ( // SUPER ADMINISTRADOR O ADMINISTRADOR
        <div className='cajamadre'>
          <h3>Administración</h3>
          <div className='cajahija'>
            <PostSucursales />
            <UpdateSucursales />
            <DeleteSucursales />
          </div>
        </div>
      )}
    </>
  );
};

export default SucursalesPanel;