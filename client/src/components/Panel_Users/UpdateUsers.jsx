/* PANEL DE ADMINISTRACIÓN DE USUARIOS -- ACTUALIZAR */
import { useState } from 'react';
import axios from '../../api/axiosConfig';

const UpdateUsers = () => {
  const [formData, setFormData] = useState({
    id: '',
    nickname: '',
    psw: '',
    tipo: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const cambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'radio' ? value : type === 'checkbox' ? checked : value
    }));
  };

  // Actualizar un usuario
  const actualizar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/users/actualizar`, formData);
      setMessage(response.data.message || 'Usuario actualizado exitosamente');
      window.location.reload();
    } catch (error) {
      console.error('Error: // Actualizar un usuario, ', error);
      setMessage(error.response?.data?.message || 'Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='caja actualizar'>
        <h5>Actualizar</h5>
        <form onSubmit={actualizar}>
          <label htmlFor="nickname">Nombre:</label>
          <input type="text" id="nickname" name="nickname" maxLength="50" placeholder='Nombre del Usuario (Opcional)' title="Nombre del Usuario (Opcional)" value={formData.nickname} onChange={cambio} />
          <label htmlFor="psw">Contraseña:</label>
          <input type="text" id="psw" name="psw" maxLength="50" placeholder='Contraseña del Usuario (Opcional)' title='Contraseña del Usuario (Opcional)' value={formData.psw} onChange={cambio} />
          <label htmlFor="usuarios">Usuario:</label>
          <select id="usuarios" name="tipo" className='usuarios' title='Tipo de Usuario' value={formData.tipo} onChange={cambio}>
            <option value="" className='tipousuario'>Seleccione: (Opcional)</option>
            <option value="Geografia" >Geografía</option>
            <option value="Aplicativo" >Aplicativo</option>
            <option value="Administrador" >Administrador</option>
          </select>
          <div className='update'>
            <label htmlFor="id"><span className='ReActualizar'>*</span>ID:</label>
            <input type="text" id="id" name="id" maxLength="5" required placeholder='Elemento que actualizará' title="Elemento que actualizará" value={formData.id} onChange={cambio} />
            <button type="submit" disabled={loading}>Actualizar</button>
          </div>
        </form >
        <div className='avisos'>
          {message && message.split('\n').map((linea, i) => (
            <p key={i}>{linea}</p>
          ))}
        </div>
      </div >
    </>
  );
};

export default UpdateUsers;