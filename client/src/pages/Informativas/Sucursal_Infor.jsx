/* PAGINA DE INFORME -- SUCURSALES */
import { React, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import InfoSucursal from '../../components/Informativas/Infor_Sucursal.jsx';

const SucursalInfo = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2 || user.id === 3 || user.id === 4) && ( // TODOS
                <div>
                    <InfoSucursal />
                </div>
            )}
        </>
    );
};

export default SucursalInfo;