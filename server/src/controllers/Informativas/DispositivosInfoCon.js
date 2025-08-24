/* CONTROLADORES DE INFORMATIVA -- DISPOSITIVOS */
import { dispositivosNombre, infoDispositivo } from '../../services/Informativas/DispositivosInfoSer.js';

// Recibir el nombre del dispositivo
const nombre = async (req, res) => {
	try {
		const dispositivo = req.params.nombre;
		req.session.dispositivo = dispositivo;
		req.session.save(err => {
			if (err) { console.error('Error al guardar la sesión:', err); }
		});
		res.sendStatus(200);
	} catch (error) {
		console.error('Error: // Recibir el nombre del dispositivo, ', error);
		res.sendStatus(500);
	}
};

// Mandar los dispositivos con ese nombre
const getDispositivosNombre = async (req, res) => {
	try {
		const dispositivo = req.session.dispositivo;
		const responsable = req.session.user;
		const tipo = req.session.tipo;
		const result = await dispositivosNombre(dispositivo, responsable, tipo);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error: // Mandar los dispositivos con ese nombre, ', error);
		res.status(error?.code || 500).json({ message: error?.message || "Error al obtener los dispositivos" });
	}
};

// Pedir los datos de los dispositivos
const getInfoDispositivos = async (req, res) => {
	try {
		const dispositivo = req.params.dispo;
		const responsable = req.session.user;
		const tipo = req.session.tipo;
		const result = await infoDispositivo(dispositivo, responsable, tipo);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error: // Pedir los datos de los dispositivos, ', error);
		res.status(error?.code || 500).json({ message: error?.message || "Error al obtener los datos de los dispositivos" });
	}
};

export const methods = { nombre, getDispositivosNombre, getInfoDispositivos };