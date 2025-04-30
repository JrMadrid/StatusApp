/* PANEL DE ADMINISTRACIÓN DE USUARIOS -- CREAR */
import React, { useState } from 'react';
import axios from '../../api/axiosConfig'; 

const PostUsers = () => {
    const [formData, setFormData] = useState({
        nickname: '',
        psw: '',
        tipo: 'Geografia'
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const cambio = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: checked ? 1 : 0
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    
    const Agregar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/users/agregar`, formData);
            setMessage(response.data.message || 'Usuario agregado exitosamente');
            window.location.reload(); 
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al agregar el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='caja agregar'>
                <h5>Agregar</h5>
                <form onSubmit={Agregar}>
                    <label htmlFor="nickname"><span className='ReAgregar'>*</span>Nombre:</label>
                    <input type="text" id="nickname" name="nickname" maxLength="50" required placeholder='Nombre del Usuario' title="Nombre del Usuario" value={formData.nickname} onChange={cambio} />
                    <label htmlFor="psw"><span className='ReAgregar'>*</span>Contraseña:</label>
                    <input type="text" id="psw" name="psw" maxLength="50" required placeholder='Contraseña del Usuario' title='Contraseña del Usuario' value={formData.psw} onChange={cambio} />
                    <label htmlFor="usuarios"><span className='ReAgregar'>*</span>Usuario:</label>
                    <select id="usuarios" name="tipo" className='usuarios' title='Tipo de Usuario' value={formData.tipo} onChange={cambio} required>
                        <option value="Geografia" >Geografía</option>
                        <option value="Aplicativo" >Aplicativo</option>
                        <option value="Administrador" >Administrador</option>
                    </select>
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

export default PostUsers;