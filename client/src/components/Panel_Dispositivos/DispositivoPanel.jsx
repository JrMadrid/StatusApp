/* COMPONENTE DE PANEL DE ADMINISTRACIÓN DE DISPOSITIVOS */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PostDispositivo from "./PostDispositivo";
import UpdateDispositivo from "./UpdateDispositivo";
import DeleteDispositivo from "./DeleteDispositivo";
import './../css/panel.css';

const DispositivosPanel = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2) && ( // SUPER ADMINISTRADOR O ADMINISTRADOR
                <div className='cajamadre'>
                    <h3>Administración</h3>
                    <div className='cajahija'>
                        <PostDispositivo />
                        <UpdateDispositivo />
                        <DeleteDispositivo />
                    </div >
                </div >
            )}
        </>
    )
};

export default DispositivosPanel;