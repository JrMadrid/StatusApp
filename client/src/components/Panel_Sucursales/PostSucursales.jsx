/* PANEL DE ADMINISTRACIÓN DE SUCURSALES -- CREAR */
import { useState } from 'react';
import axios from '../../api/axiosConfig';

const PostSucursales = () => {
	const [formData, setFormData] = useState({
		canal: '',
		nombre: '',
		economico: '',
		ingresponsable: '',
		rellenar: ''
	});
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const cambio = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Agregar una nueva sucursal
	const Agregar = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');
		try {
			const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/sucursales/agregar`, formData);
			setMessage(response.data.message || 'Sucursal agregado exitosamente');
			window.location.reload(); // Recargar la página para ver la nueva sucursal
		} catch (error) {
			setMessage(error.response?.data?.message || 'Error al agregar la sucursal');
			console.error('Error // Agregar una nueva sucursal, ', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className='caja agregar'>
				<form onSubmit={Agregar}>
					<h5>Agregar</h5>
					<label htmlFor="economico"><span className='ReAgregar'>*</span>Económico:</label>
					<input type="text" id="economico" name="economico" maxLength="6" minLength="6" required placeholder='Número económico' title="6 caracteres numéricos" value={formData.economico} onChange={cambio} />
					<label htmlFor="canal"><span className='ReAgregar'>*</span>Canal:</label>
					<input type="text" id="canal" name="canal" maxLength="30" required placeholder='Canal de la Sucursal' title='Canal' value={formData.canal} onChange={cambio} />
					<label htmlFor="nombre"><span className='ReAgregar'>*</span>Nombre:</label>
					<input type="text" id="nombre" name="nombre" maxLength="50" required placeholder='Nombre de la Sucursal' title='Nombre' value={formData.nombre} onChange={cambio} />
					<label htmlFor="ingresponsable"><span className='ReAgregar'>*</span>Ing. Responsable:</label>
					<input type="text" id="ingresponsable" name="ingresponsable" maxLength="50" required placeholder='Ingeniero responsable' title="Ingeniero responsable" value={formData.ingresponsable} onChange={cambio} />
					<div className='re-options'>
						<label>Rellenar:</label>
						<input id='siRellenar' type="radio" name="rellenar" value="yes" checked={formData.rellenar === 'yes'} onChange={cambio} />
						<label className='re-boolean' htmlFor='siRellenar'>Sí</label>
						<input id='noRellenar' type="radio" name="rellenar" value="no" checked={formData.rellenar === 'no'} onChange={cambio} />
						<label className='re-boolean' htmlFor='noRellenar'>No</label>
						<input id='nada' type="radio" name="rellenar" value="" checked={formData.rellenar === ''} onChange={cambio} />
						<label className='re-boolean' htmlFor='nada'></label>
					</div>
					<p className='paviso'>(Opcional)</p>
					<p className='paviso'>Rellenará la sucursal con dispositivos</p>
					<p className='paviso'>"Sin inventario"</p>
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

export default PostSucursales;