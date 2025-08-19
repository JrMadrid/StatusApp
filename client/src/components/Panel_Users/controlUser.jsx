/* PANEL DE ADMINISTRACIÓN DE USUARIOS -- CONTROLAR */
import axios from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const ControlUsers = () => {

  // Cerrar la sesión de todos los usuarios
  const desconectar = async () => {
    let url = `http://${process.env.REACT_APP_HOST}/panel/users/logoutall`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        toast.success("Se cerraron todas las sesiones");
      }
    } catch (error) {
      console.error('Error: // Cerrar la sesión de todos los usuarios, ', error);
      toast.error(error.mesage || 'Error al cerrar sesiones');
    }
  };

  // Desactivar el acceso de todos los usuarios
  const desactivar = async () => {
    let url = `http://${process.env.REACT_APP_HOST}/panel/users/deactivateall`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        toast.success("Se desactivaron todos los usuarios");
      }
    } catch (error) {
      console.error('Error: // Desactivar el acceso de todos los usuarios, ', error);
      toast.error(error.mesage || 'Error al desactivar accesos');
    }
  };

  // Activar el acceso de todos los usuarios
  const activar = async () => {
    let url = `http://${process.env.REACT_APP_HOST}/panel/users/activateall`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        toast.success("Se activaron todos los usuarios");
      }
    } catch (error) {
      console.error('Error: // Activar el acceso de todos los usuarios, ', error);
      toast.error(error.mesage || 'Error al activar accesos');
    }
  };

  return (
    <>
      <div className='caja' style={{ backgroundColor: 'black' }}>
        <p className='paviso'>Lo siguiente no le afectará</p>
        <button className='desconectar' onClick={() => { desconectar(); }}>Desconectar usuarios</button>
        <p className='paviso'>Cerrará la sesión de todos los usuarios conectados</p>
        <button className='desconectar' onClick={() => { desactivar(); }}>Desactivar usuarios</button>
        <p className='paviso'>Se desactivará el acceso a todos los usuarios</p>
        <button className='desconectar' onClick={() => { activar(); }}>Activar usuarios</button>
        <p className='paviso'>Se activará el acceso a todos los usuarios</p>
      </div>
    </>
  );
};

export default ControlUsers;