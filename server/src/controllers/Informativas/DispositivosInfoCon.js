/* CONTROLADORES DE INFORMATIVA -- DISPOSITIVOS */
import { getDispositivosPorNombre, getInfoDispositivo } from '../../services/Informativas/DispositivosInfoSer.js';

// Pide el nombre
const nombre = async (req, res) => {
	try {
		const dispositivo = req.params.nombre;
		req.session.dispositivo = dispositivo;
		req.session.save(err => {
			if (err) {
				console.error('Error al guardar la sesión:', err);
			}
		});
	} catch (error) {
		console.error('Error :', error);
	}
};

// Manda los dispositivos con ese nombre
const dispositivos = async (req, res) => {
	try {
		const dispositivo = req.session.dispositivo;
		const responsable = req.session.user;
		const tipo = req.session.tipo;
		const result = await getDispositivosPorNombre(dispositivo, responsable, tipo);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error :', error);
		res.status(500).send("Error al obtener los dispositivos");
	}
};

// Consulta para los datos de los dispositivos
const info = async (req, res) => {
	try {
		const dispositivo = req.params.dispo;
		const responsable = req.session.user;
		const tipo = req.session.tipo;
		const result = await getInfoDispositivo(dispositivo, responsable, tipo);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send("Error al obtener los datos");
	}
};

export const methods = {
	info,
	nombre,
	dispositivos
};
