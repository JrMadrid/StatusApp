/* COMPONENTE DE PANEL DE ADMINISTRACIÓN DE MANTENIMIENTOS */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PostMantenimientos from './PostMantenimientos';
import DeleteMantenimientos from './DeleteMantenimientos';
import './../css/panel.css';

const MantenimientosPanel = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2) && ( // SUPER ADMINISTRADOR O ADMINISTRADOR
                <div className='cajamadre'>
                    <h3>Administración</h3>
                    <div className='cajahija'>
                        <PostMantenimientos />
                        <DeleteMantenimientos /> 
                    </div>
                </div>
            )}
        </>
    );
};

export default MantenimientosPanel;