/* PAGINA DE INFORMATIVA -- DISPOSITIVOS */
import { React, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import InfoDispositivo from '../../components/Informativas/Infor_Dispositivos.jsx';

const DispositivosInfo = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2 || user.id === 3 || user.id === 4) && ( // TODOS
                <div>
                    <InfoDispositivo />
                </div>
            )}
        </>
    );
};

export default DispositivosInfo;