/* PAGINA DE INFORMATIVA -- MANTENIMIENTOS */
import { React, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import InfoMante from "../../components/Informativas/infor_Mantenimientos.jsx";

const MantenimientosInfo = () => {
    const user = useContext(UserContext);

    return (
        <>
            {user && (user.id === 1 || user.id === 2 || user.id === 3 || user.id === 4) && ( // TODOS
                <div>
                    <InfoMante />
                </div>
            )}
        </>
    );
};

export default MantenimientosInfo;