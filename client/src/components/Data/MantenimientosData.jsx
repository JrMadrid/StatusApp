/* COMPONENTE DE TABLA DE MANTENIMIENTOS PARA APLICATIVO Y GEOGRAFIA */
import { useState, useEffect } from 'react';
import fetchData from '../../api/fetchConfig.js';
import { Paginador } from '../Elements/Paginador.jsx'
import toast from 'react-hot-toast';

const MantenimientoTable = () => {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);

	// Pedir los datos de los mantenimientos de las sucursales
	useEffect(() => {
		const url = `http://${process.env.REACT_APP_HOST}/api/mantenimientos`;
		const mantenimientos = async () => {
			try {
				const response = await fetchData(url);
				const mantenimientos = await response.json();
				if (!response.ok) {
					throw new Error(mantenimientos.message || 'Lo sentimos, ocurrió un problema');
				}

				setData(mantenimientos);
				setCount(mantenimientos.length);

			} catch (error) {
				console.error('Error consiguiendo los datos: ', error);
				toast.error(error.message || 'Error con los datos');
			}
		};

		mantenimientos();
	}, []);

	// Pedir el número economico
	const eleccion = async (economico, id) => {
		let url = `http://${process.env.REACT_APP_HOST}/informe/mantes/numero/${economico}/${id}`;
		localStorage.setItem('idMantenimiento', id); // guarda el ID
		try {
			const response = await fetchData(url);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
			}
		} catch (error) {
			console.error('Error consiguiendo los datos: ', error);
			toast.error(error.message || 'Error con la elección');
		}
	};

	return (
		<>
			<Paginador tipo='mantenimiento' titulo='MANTENIMIENTOS' placeholder='Buscar por Número económico, ing. Responsable o Fechas' data={data} excel='si' save='Mantenimientos' eleccion={eleccion} cantidad={count} />
		</>
	);
}

export { MantenimientoTable };