/* PAGINA DE PANEL DE ADMINISTRACIÓN DE DISPOSITIVOS */
import { useContext } from "react";
import { UserContext } from '../../context/UserContext.jsx';
import SelectDispositivos from '../../components/Panel_Dispositivos/SelectDispositivos.jsx';
import DispositivosPanel from '../../components/Panel_Dispositivos/DispositivoPanel.jsx';
import '../css/section.css';

const PanDispositivos = () => {
  const user = useContext(UserContext);
  return (
    <>
      {user && (user.id === 1 || user.id === 2) && ( // SUPER ADMINISTRADOR Y ADMINISTRADOR
        <div className='display'>
          <div className='section tabla'>
            <SelectDispositivos />
          </div>
          <div className='section panel'>
            <DispositivosPanel />
          </div>
        </div>

      )}
    </>
  )
};

export default PanDispositivos;