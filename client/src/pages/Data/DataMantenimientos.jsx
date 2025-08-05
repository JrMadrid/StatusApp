/* PAGINA DE TABLA DE MANTENIMIENTOS PARA APLICATIVO Y GEOGRAFIA */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import { MantenimientoTable } from '../../components/Data/MantenimientosData.jsx';
import ConstanciaPanel from '../../components/Panel_Mantenimiento/ConstanciaPanel.jsx';
import '../css/section.css';

const Mantenimientos = () => {
    const user = useContext(UserContext)
    return (
        <>
            {user && (user.id === 3 || user.id === 4) && ( // APLICATIVO Y GEOGRAFIA
                <div className='display'>
                    <div className='section tabla'>
                        <MantenimientoTable />
                    </div>
                    <div className='section panel'>
                        <ConstanciaPanel />
                    </div>
                </div>
            )}
        </>
    )
};

export default Mantenimientos;