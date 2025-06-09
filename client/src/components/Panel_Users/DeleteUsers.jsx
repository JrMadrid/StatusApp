/* PANEL DE ADMINISTRACIÓN DE USUARIOS -- ELIMINAR */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';

const DeleteUsers = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const cambio = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const eliminar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/users/eliminar`, formData);
            setMessage(response.data.message || 'Usuario eliminado exitosamente');
            window.location.reload();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al eliminar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const desconectar = async () => {
        let url = `http://${process.env.REACT_APP_HOST}/panel/users/logoutall`;
        try {
            await axios.get(url)
        } catch (error) {
            console.error('Error desconectando a los usuarios: ', error);
        }
    }

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
            <div className='caja'>
                <button className='desconectar' onClick={() => { desconectar(); navigate('/'); }}>Desconectar Usuarios</button>
                <p className='paviso'>Destruirá la sesión de todos los usuarios conectados</p>
            </div>
        </>
    );
};

export default DeleteUsers;