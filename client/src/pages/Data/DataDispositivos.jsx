/* PAGINA DE TABLA DE DISPOSITIVOS PARA APLICATIVO Y GEOGRAFIA */
import { useContext } from 'react';
import { DispositivoTable } from '../../components/Data/DispositivosData.jsx';
import { UserContext } from '../../context/UserContext.jsx';

const Dispositivos = () => {
    const user = useContext(UserContext)
    return (
        <>
            <div>
                {user &&(user.id === 3 || user.id === 4) && ( // APLICATIVO Y GEOGRAFIA
                    <DispositivoTable />
                )}
            </div>
        </>
    )
};

export default Dispositivos;