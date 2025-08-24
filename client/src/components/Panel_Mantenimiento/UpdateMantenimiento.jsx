/* PANEL DE ADMINISTRACIÓN DE SUCURSALES -- ACTUALIZAR */
import { useState } from 'react';
import axios from '../../api/axiosConfig';

const UpdateMantenimientos = () => {
  const [formData, setFormData] = useState({
    economico: '',
    festimada: '',
    id: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const cambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Agregar un mantenimiento
  const Actualizar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/mantenimientos/actualizar`, formData);
      setMessage(response.data.message || 'Mantenimiento actualizado exitosamente');
      window.location.reload();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al actualizar el mantenimiento');
      console.error("Error: // Actualizar un mantenimiento, ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='caja actualizar'>
        <form onSubmit={Actualizar}>
          <h5>Agregar</h5>
          <label htmlFor="festimada">Fecha Estimada: </label>
          <input type="date" id="festimada" name="festimada" value={formData.festimada} onChange={cambio} style={{ marginBottom: '4px' }} />
          <p className="paviso">Mes/Dia/Año</p>
          <label htmlFor="economico">Económico:</label>
          <input type="text" id="economico" name="economico" maxLength="6" minLength="6" placeholder='Número económico' title="6 caracteres numéricos" value={formData.economico} onChange={cambio} />
          <div className="update">
            <label htmlFor="id"><span className='ReActualizar'>*</span>ID: </label>
            <input type="text" id="id" name="id" maxLength="5" placeholder='Elemento que actualizara' title='ID' min='2' pattern='\d{1,5}' value={formData.id} onChange={cambio} required />
            <button type="submit" disabled={loading}>Actualizar</button>
          </div>
        </form>
        <div className='avisos'>
          {message && message.split('\n').map((linea, i) => (
            <p key={i}>{linea}</p>
          ))}
        </div>
      </div >
    </>
  );
};

export default UpdateMantenimientos;