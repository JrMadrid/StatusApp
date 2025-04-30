/* PAGINA DE INFORME -- DISPOSITIVOS */
import { React, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import InfoDevice from '../../components/Informes/Infor_Device.jsx';

const DeviceInfo = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2 || user.id === 3 || user.id === 4) && ( // TODOS
                <div>
                    <InfoDevice />
                </div>
            )}
        </>
    );
};

export default DeviceInfo;