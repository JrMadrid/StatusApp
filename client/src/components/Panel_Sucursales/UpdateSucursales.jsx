/* PANEL DE ADMINISTRACIÓN DE SUCURSALES -- ACTUALIZAR */
import { useState } from 'react';
import axios from '../../api/axiosConfig';

const UpdateSucursales = () => {
	const [formData, setFormData] = useState({
		id: '',
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


	// Actualizar una sucursal
	const actualizar = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		try {
			const response = await axios.post(`http://${process.env.REACT_APP_HOST}/panel/sucursales/actualizar`, formData);
			setMessage(response.data.message || 'Sucursal actualizada exitosamente');
			window.location.reload();
		} catch (error) {
			setMessage(error.response?.data?.message || 'Error al actualizar la sucursal');
			console.error('Error // Actualizar una sucursal, ', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className='caja actualizar'>
				<form onSubmit={actualizar}>
					<h5>Actualizar</h5>
					<label htmlFor="economico">Económico:</label>
					<p className='paviso'>También cambiará el económico de los dispositivos asociados.</p>
					<input type="text" id="economico" name="economico" maxLength="6" minLength="6" placeholder='Número económico (Opcional)' title=" 6 caracteres numéricos (Opcional)" value={formData.economico} onChange={cambio} />
					<label htmlFor="canal">Canal:</label>
					<input type="text" id="canal" name="canal" maxLength="30" placeholder='Canal de la Sucursal (Opcional)' title='Canal (Opcional)' value={formData.canal} onChange={cambio} />
					<label htmlFor="nombre">Nombre:</label>
					<input type="text" id="nombre" name="nombre" maxLength="50" placeholder='Nombre de la Sucursal (Opcional)' title='Nombre (Opcional)' value={formData.nombre} onChange={cambio} />
					<label htmlFor="ingresponsable">Ing. Responsable:</label>
					<input type="text" id="ingresponsable" name="ingresponsable" maxLength="50" placeholder='Ingeniero responsable' title="Ingeniero responsable (Opcional)" value={formData.ingresponsable} onChange={cambio} />
					<div className='re-options'>
						<label>Rellenar:</label>
						<input id='siRellenarA' type="radio" name="rellenar" value="yes" checked={formData.rellenar === 'yes'} onChange={cambio} />
						<label className='re-boolean' htmlFor='siRellenarA'>Sí</label>
						<input id='noRellenarA' type="radio" name="rellenar" value="no" checked={formData.rellenar === 'no'} onChange={cambio} />
						<label className='re-boolean' htmlFor='noRellenarA'>No</label>
						<input id='nadaA' type="radio" name="rellenar" value="" checked={formData.rellenar === ''} onChange={cambio} />
						<label className='re-boolean' htmlFor='nadaA'></label>
					</div>
					<p className='paviso'>(Opcional)</p>
					<p className='paviso'>Rellenará la sucursal con los dispositivos que le falten</p>
					<p className='paviso'>"Sin inventario"</p>
					<div className="update">
						<label htmlFor="id"><span className='ReActualizar'>*</span>ID:</label>
						<input type="text" id="id" name="id" maxLength="5" required placeholder='Elemento que actualizara' title='ID' min='1' pattern='\d{1,5}' value={formData.id} onChange={cambio} />
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

export default UpdateSucursales;