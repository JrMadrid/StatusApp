/* PANEL DE ADMINISTRACIÓN DE MANUALES -- ACTUALIZAR */
import { useState } from 'react';
import axios from '../../api/axiosConfig';

const PostManual = () => {
	const [formData, setFormData] = useState({
		id: '',
		nombre: '',
		descripcion: ''
	});
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const cambio = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};


	// Actualizar un manual
	const Actualizar = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		try {
			const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/manuales/actualizar`, formData);
			setMessage(response.data.message || 'Manual actualizado exitosamente');
			window.location.reload();
		} catch (error) {
			setMessage(error.response?.data?.message || 'Error al actualizar el manual');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className='caja actualizar'>
				<form onSubmit={Actualizar}>
					<h5>Actualizar</h5>
					<label htmlFor="nombre">Nombre: </label>
					<input type="text" id="nombre" name="nombre" maxLength="100" placeholder="Nombre del manual (Opcional)" value={formData.nombre} onChange={cambio} />
					<label htmlFor="descripcion" style={{ marginTop: '5px' }}>Descripción:</label>
					<textarea className='textarea' style={{ marginTop: '5px' }} id="descripcion" name="descripcion" maxLength="100" placeholder="Descripción del manual (Opcional)" title="100 Caracteres máximos" value={formData.descripcion} onChange={cambio} rows={4} />
					<div className='update'>
						<label htmlFor="id"><span className='ReActualizar'>*</span>ID:</label>
						<input type="number" id="id" name="id" maxLength="5" required placeholder='Elemento que actualizará' title="Elemento que actualizará" value={formData.id} onChange={cambio} />
						<button type="submit" disabled={loading}>Actualizar</button>
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