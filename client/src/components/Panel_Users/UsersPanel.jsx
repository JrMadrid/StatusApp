/* COMPONENTE DE PANEL DE ADMINISTRACIÓN DE USUARIOS */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PostUsers from "./PostUsers";
import UpdateUsers from "./UpdateUsers";
import DeleteUsers from "./DeleteUsers";
import ControlUsers from './controlUser';
import './../css/panel.css';

const UsersPanel = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1) && ( // SUPER ADMINISTRADOR
                <div className='cajamadre'>
                    <h3>Administración</h3>
                    <div className='cajahija'>
                        <PostUsers />
                        <UpdateUsers />
                        <DeleteUsers />
                        <ControlUsers />
                    </div >
                </div >
            )}
        </>
    );
};

export default UsersPanel;