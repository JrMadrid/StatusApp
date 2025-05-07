/* PANEL DE ADMINISTRACIÓN DE DISPOSITIVOS -- ACTUALIZAR */
import React, { useState } from 'react';
import axios from '../../api/axiosConfig'; 

const UpdateDispositivo = () => {
    const [formData, setFormData] = useState({
        economico: '',
        ip: '',
        nombre: '',
        reiniciar: '',
        descripcion: '',
        general: '',
        id: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const cambio = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const Actualizar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/dispositivos/actualizar`, formData);
            window.location.reload();
            setMessage(response.data.message || 'Dispositivo actualizado exitosamente');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al actualizar el dispositivo');

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='caja actualizar'>
                <h5>Actualizar</h5>
                <form onSubmit={Actualizar}>
                    <label htmlFor="nombre">Dispositivo:</label>
                    <input type="text" id="nombre" name="nombre" maxLength="75" placeholder='Nombre del dispositivo (Opcional)' title="Nombre del dispositivo (Opcional)" onChange={cambio} value={formData.nombre} />
                    <label htmlFor="ip">IP:</label>
                    <input type="text" id="ip" name="ip" maxLength="15" placeholder='xxx.xxx.xxx.xxx (Opcional)' title='(IPv4)' pattern="((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)" onChange={cambio} value={formData.ip} />
                    <p className='paviso'>Ip especiales inician con</p>
                    <p className='paviso'>Sin inventario: 000.</p>
                    <p className='paviso'>No aplica: 001.</p>
                    <label htmlFor="economico">Económico:</label>
                    <input type="text" id="economico" name="economico" maxLength="6" minLength="6" placeholder='Número económico (Existente) (Opcional)' title="6 caracteres numéricos (Existente) (Opcional)" onChange={cambio} value={formData.economico} />
                    <label htmlFor="descripcion">Descripción:</label>
                    <input type="text" id="descripcion" name="descripcion" maxLength="100" minLength="0" placeholder='Descripción del Dispositivo (Opcional)' title="100 Caracteres maximos" value={formData.descripcion} onChange={cambio} />
                    <label htmlFor="general">General:</label>
                    <textarea className='textarea' id="general" name="general" maxLength={8000} placeholder='Información general del dispositivo (Opcional)' title="8000 Caracteres máximos" value={formData.general} onChange={cambio} rows={4} />
                    <div className='re-options'>
                        <label>Reiniciar:</label>
                        <input id='siReiniciar' type="radio" name="reiniciar" value="yes" checked={formData.reiniciar === 'yes'} onChange={cambio} />
                        <label className='re-boolean' htmlFor='siReiniciar'>Sí</label>
                        <input id='noReinciar' type="radio" name="reiniciar" value="no" checked={formData.reiniciar === 'no'} onChange={cambio} />
                        <label className='re-boolean' htmlFor='noReinciar'>No</label>
                        <input id='nada' type="radio" name="reiniciar" value="" checked={formData.reiniciar === ''} onChange={cambio} />
                        <label className='re-boolean' htmlFor='nada'></label>
                    </div>
                    <p className='paviso'>(Opcional)</p>
                    <p className='paviso'>Reiniciará los datos alojados en la base de datos (Descripción y General)</p>
                    <div className="update">
                        <label htmlFor="id"><span className='ReActualizar'>*</span>ID:</label>
                        <input type="number" id="id" name="id" maxLength="5" placeholder='Elemento que eliminará' title='ID' min='1' pattern='\d{1,5}' required onChange={cambio} value={formData.id} />
                        <button type="submit" disabled={loading}>Actualizar</button>
                    </div>
                </form>
                <div className='avisos'>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </>
    );
};

export default UpdateDispositivo;