/* PAGINA DE INFORMATIVA -- USUARIO */
import { React, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import InfoUsuario from '../../components/Informativas/Infor_Usuario.jsx';

const UsuarioInfo = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1) && ( // SUPER ADMINISTRADOR
                <div>
                    <InfoUsuario />
                </div>
            )}
        </>
    );
};

export default UsuarioInfo;