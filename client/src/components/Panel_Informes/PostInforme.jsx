/* PANEL DE ADMINISTRACIÓN DE INFORMES -- CREAR */
import React, { useState } from 'react';
import axios from '../../api/axiosConfig';

const PostInforme = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        economico: '',
        frealizada: '',
        archivo: null,
        descripcion: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [documento, setDocumento] = useState('Sin documento');

    const cambio = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const cambioArchivo = (e) => {
        const file = e.target.files[0]; // Obtener el primer archivo seleccionado
        if (file) {
            const fileType = file.type; // Obtener el tipo de archivo
            if (fileType === 'application/pdf') { // Verificar si el tipo de archivo es PDF
                setDocumento(file.name); // Guardar el nombre del archivo en el estado
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
        DatosParaEnviar.append('informe', formData.archivo); // Agregar el archivo al FormData
        DatosParaEnviar.append('economico', formData.economico);
        DatosParaEnviar.append('frealizada', formData.frealizada);
        DatosParaEnviar.append('nombre', formData.nombre);
        DatosParaEnviar.append('descripcion', formData.descripcion);
        DatosParaEnviar.append('documento', documento);        
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/informes/agregar`, DatosParaEnviar, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Asegúrate de que el tipo de contenido sea correcto -- multipart/form-data es para archivos
                },
            });
            setMessage(response.data.message || 'Informe agregado exitosamente');
            window.location.reload(); // Recargar la página para ver el nuevo informe
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al agregar el informe');
        } finally {
            setLoading(false); // Desactivar el estado de carga después de la solicitud
        }
    };

    return (
        <>
            <div className='caja agregar'>
                <form onSubmit={Agregar}>
                    <h5>Agregar</h5>
                    <label><span className='ReAgregar' style={{ fontSize: '1.2rem', paddingLeft: '3px' }}>*</span>Informe: </label>
                    <label htmlFor="informe" className="subirConstancia" style={{ marginTop: '5px' }}>
                        Subir Informe
                    </label>
                    <p className="paviso">Solo archivos .pdf</p>
                    <input type="file" id="informe" onChange={cambioArchivo} style={{ display: 'none' }} accept=".pdf" required />
                    <div className='avisos'>
                        {documento && <p>{documento}</p>}
                    </div>
                    <label htmlFor="economico" style={{ marginTop: '5px' }}><span className='ReAgregar'>*</span>Económico:</label>
                    <input type="text" id="economico" name="economico" maxLength="6" minLength="6" required placeholder='Número económico' title="6 caracteres numéricos" value={formData.economico} onChange={cambio} />
                    <label htmlFor="frealizada"><span className='ReAgregar'>*</span>Fecha Realizado: </label>
                    <input type="date" id="frealizada" name="frealizada" value={formData.frealizada} onChange={cambio} required style={{marginBottom:'4px'}}/>
                    <p className="paviso">Mes/Dia/Año</p>
                    <label htmlFor="nombre">Nombre: </label>
                    <input type="text" id="nombre" name="nombre" maxLength="100" placeholder="Nombre del informe (Opcional)" value={formData.nombre} onChange={cambio} style={{marginBottom:'4px'}}/>
                    <p className='paviso'>Se puede tomar directo del documento</p>
                    <label htmlFor="descripcion" style={{ marginTop: '5px' }}>Descripción:</label>
                    <textarea className='textarea' style={{ marginTop: '5px' }} id="descripcion" name="descripcion" maxLength="100" placeholder="Descripción del informe (Opcional)" title="100 Caracteres máximos" value={formData.descripcion} onChange={cambio} rows={4} />
                    <div className="add">
                        <button type="submit" disabled={loading}>Agregar</button>
                    </div>
                </form>
                <div className='avisos'>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </>
    );
};

export default PostInforme;