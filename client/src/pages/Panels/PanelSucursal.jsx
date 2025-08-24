/* PAGINA DE PANEL DE ADMINISTRACIÓN DE SUCURSALES */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import SelectSucursales from '../../components/Panel_Sucursales/SelectSucursales.jsx';
import SucursalesPanel from '../../components/Panel_Sucursales/SucursalesPanel.jsx';
import '../css/section.css';

const PanSucursales = () => {
    const user = useContext(UserContext);
    return (
        <>
            {user && (user.id === 1 || user.id === 2) && ( // SUPER ADMINISTRADOR Y ADMINISTRADOR
                <div className='display'>
                    <div className='section tabla'>
                        <SelectSucursales />
                    </div>
                    <div className='section panel'>
                        <SucursalesPanel />
                    </div>
                </div>
            )}
        </>
    );
};

export default PanSucursales;