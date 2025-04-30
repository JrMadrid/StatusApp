/* PAGINA DE INFORME -- SUCURSALES */
import { React, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import InfoApp from '../../components/Informes/Infor_App.jsx';

const AppInfo = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2 || user.id === 3 || user.id === 4) && ( // TODOS
                <div>
                    <InfoApp />
                </div>
            )}
        </>
    );
};

export default AppInfo;