/* PAGINA DE INFORME -- INFORMES */
import { React, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import InfoInforme from '../../components/Informativas/infor_Informe.jsx';

const InformeInfo = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2 || user.id === 3 || user.id === 4) && ( // TODOS
                <div>
                    <InfoInforme />
                </div>
            )}
        </>
    );
};

export default InformeInfo;