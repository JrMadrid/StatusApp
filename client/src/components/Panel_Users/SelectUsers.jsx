/* PANEL DE ADMINISTRACIÓN DE USUARIOS -- VISUALIZAR */
import { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js';
import { Paginador } from '../Elements/Paginador.jsx';
import toast from 'react-hot-toast';

const SelectUsers = () => {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);

	// Pedir los datos de los usuarios
	useEffect(() => {
		const url = `http://${process.env.REACT_APP_HOST}/panel/users`;
		const usuarios = async () => {
			try {
				const response = await fetchData(url);
				const jsonData = await response.json();
				if (!response.ok) {
					throw new Error(jsonData.message || 'Lo sentimos, ocurrió un problema');
				}
				setData(jsonData);
				setCount(jsonData.length);

			} catch (error) {
				console.error('Error: // Pedir los datos de los usuarios, ', error);
				toast.error(error.message || 'Error con los datos');
			}
		};

		usuarios();
	}, []);

	// Pedir el nombre del usuario
	const eleccion = async (nickname) => {
		let url = `http://${process.env.REACT_APP_HOST}/informe/users/usuario/${nickname}`;
		localStorage.setItem('nicknamePersonal', nickname); // guarda el nickname
		try {
			const response = await fetchData(url);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
			}
		} catch (error) {
			console.error('Error: // Pedir el nombre del usuario, ', error);
			toast.error(error.message || 'error con eL nombre');
		}
	};

	return (
		<>
			<Paginador tipo='usuarios' titulo='USUARIOS' placeholder='Buscar por Nombre o Usuario' data={data} eleccion={eleccion} cantidad={count} />
		</>
	);
};

export default SelectUsers; 