/* PANEL DE ADMINISTRACIÓN DE INFORMES -- ELIMINAR */
import { useState } from 'react';
import axios from '../../api/axiosConfig';

const DeleteInforme = () => {
    const [formData, setFormData] = useState({
        id: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const cambio = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Eliminar un informe
    const eliminar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/informes/eliminar`, formData);
            setMessage(response.data.message || 'Informe eliminado exitosamente');
            window.location.reload();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al eliminar el informe');
            console.error('Error: // Eliminar un informe, ',error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='caja eliminar'>
                <h5>Eliminar</h5>
                <form onSubmit={eliminar}>
                    <div className="delete">
                        <label htmlFor="id"><span className='ReEliminar'>*</span>ID: </label>
                        <input type="text" id="id" name="id" maxLength="5" placeholder='Elemento que eliminará' title='ID' min='2' pattern='\d{1,5}' value={formData.id} onChange={cambio} required />
                        <button type="submit" disabled={loading}>Eliminar</button>
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

export default DeleteInforme;