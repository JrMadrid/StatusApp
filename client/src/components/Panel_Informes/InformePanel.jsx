/* COMPONENTE DE PANEL DE ADMINISTRACIÓN DE INFORMES */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PostInforme from './PostInforme';
import DeleteInforme from './DeleteInforme';
import './../css/panel.css';

const InformePanel = () => {
  const user = useContext(UserContext);

  return (
    <>
      {user && (user.id === 1 || user.id === 4) && (
        <div className='cajamadre'>
          {user && (user.id === 4) && ( // GEOGRAFIA
            <h3>Informe</h3>
          )}
          {user && (user.id === 1) && ( // SUPER ADMINISTRADOR
            <h3>Administración</h3>
          )}
          <div className='cajahija'>
            {user && (user.id === 4) && ( // GEOGRAFIA
              <PostInforme />
            )}
            {user && (user.id === 1) && ( // SUPER ADMINISTRADOR
              <DeleteInforme />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InformePanel;