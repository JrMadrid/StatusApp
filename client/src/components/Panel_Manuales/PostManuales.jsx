/* PANEL DE ADMINISTRACIÓN DE MANUALES -- CREAR */
import { useState } from 'react';
import axios from '../../api/axiosConfig';

const PostManual = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    archivo: null,
    descripcion: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [documento, setDocumento] = useState('Sin documento');

  const cambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Actualizar el estado con el nuevo valor
  };

  const cambioArchivo = (e) => {
    const file = e.target.files[0]; // Obtener el primer archivo seleccionado
    if (file) {
      const fileType = file.type; // Obtener el tipo de archivo
      if (fileType === 'application/pdf') { // Verificar si el tipo de archivo es PDF
        setDocumento(file.name);
        setFormData({ ...formData, archivo: file }); // Actualizar el estado con el archivo seleccionado
      } else {
        setMessage('Solo se permiten archivos .pdf');
        setDocumento('Sin documento');
        setFormData({ ...formData, archivo: null });
      }
    } else {
      setDocumento('Sin documento');
    }
  };

  // Agregar un nuevo manual
  const Agregar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.archivo) {
      setMessage('Por favor, suba un archivo válido (.pdf).');
      setLoading(false);
      return;
    }

    if (formData.descripcion.length > 100) {
      setMessage('La descripción debe tener máximo 100 caracteres.');
      setLoading(false);
      return;
    }

    const DatosParaEnviar = new FormData(); // Crear un nuevo objeto FormData
    DatosParaEnviar.append('nombre', formData.nombre); // Agregar el nombre al FormData
    DatosParaEnviar.append('manual', formData.archivo);
    DatosParaEnviar.append('descripcion', formData.descripcion);
    DatosParaEnviar.append('documento', documento);

    try {
      const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/manuales/agregar`, DatosParaEnviar, {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegúrate de que el tipo de contenido sea correcto -- multipart/form-data es para archivos
        },
      });
      setMessage(response.data.message || 'Manual agregado exitosamente');
      window.location.reload();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al agregar el manual');
      console.error('Error: // Agregar un nuevo manual, ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='caja agregar'>
        <form onSubmit={Agregar}>
          <h5>Agregar</h5>
          <label><span className='ReAgregar' style={{ fontSize: '1.2rem', paddingLeft: '3px' }}>*</span>Manual: </label>
          <label htmlFor="manual" className="subirConstancia" style={{ marginTop: '5px' }}>
            Subir Manual
          </label>
          <p className="paviso">Solo archivos .pdf</p>
          <input type="file" id="manual" onChange={cambioArchivo} style={{ display: 'none' }} accept=".pdf" required />
          <div className='avisos'>
            {documento && <p>{documento}</p>}
          </div>
          <label htmlFor="nombre">Nombre: </label>
          <input type="text" id="nombre" name="nombre" maxLength="100" placeholder="Nombre del manual (Opcional)" value={formData.nombre} onChange={cambio} style={{ marginBottom: '4px' }} />
          <p className='paviso'>Se puede tomar directo del documento</p>
          <label htmlFor="descripcion" style={{ marginTop: '5px' }}>Descripción:</label>
          <textarea className='textarea' style={{ marginTop: '5px' }} id="descripcion" name="descripcion" maxLength="100" placeholder="Descripción del manual (Opcional)" title="100 Caracteres máximos" value={formData.descripcion} onChange={cambio} rows={4} />
          <div className="add">
            <button type="submit" disabled={loading}>Agregar</button>
          </div>
        </form>
        <div className='avisos'>
          {message && message.split('\n').map((linea, i) => (
            <p key={i}>{linea}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default PostManual;