/* PAGINA DE PANEL DE ADMINISTRACIÓN DE DISPOSITIVOS */
import { React, useContext } from "react";
import { UserContext } from '../../context/UserContext.jsx';
import SelectApps from '../../components/Panel_Apps/SelectApps.jsx';
import AppsPanel from '../../components/Panel_Apps/AppsPanel.jsx';
import '../css/section.css';

const PanApps = () => {
    const user = useContext(UserContext);
    return (
        <>
            {user && (user.id === 1 || user.id === 2) && ( // SUPER ADMINISTRADOR Y ADMINISTRADOR
                <div className='display'>
                    <div className='section tabla'>
                        <SelectApps />
                    </div>
                    <div className='section panel'>
                        <AppsPanel />
                    </div>
                </div>

            )}
        </>
    )
};

export default PanApps;