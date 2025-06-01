/* CONTROLADORES DE PANEL DE DISPOSITIVOS */
import { obtenerDispositivos, agregarDispositivo, actualizarDispositivo, eliminarDispositivo } from '../../services/Paneles/panelDispositivosSer.js';
import { SchemaCrearDispositivo } from '../../validators/Paneles/panelDispositivosVal.js';
import pingHost from '../../connection/PING.js';

/* Pedimos los datos de los dispositivos */
const getDispositivos = async (req, res) => {
	try {
		const dispositivos = await obtenerDispositivos();
		res.json(dispositivos);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('Error al obtener los datos');
	}
};

/* Agregamos un nuevo dispositivo */
const postDispositivo = async (req, res) => {
	try {
		// 1. Validar el body con Joi
		// const { error } = SchemaCrearDispositivo.validate(req.body, { abortEarly: false }); // .validate sirve para validar el objeto y devuelve un objeto con error si hay problemas; abortEarly: false para obtener todos los errores, no solo el primero
		const { error } = SchemaCrearDispositivo.validate(req.body, { abortEarly: false }); // .validate sirve para validar el objeto y devuelve un objeto con error si hay problemas; abortEarly: false para obtener todos los errores, no solo el primero

		// 2. Si hay errores, devolverlos al frontend
		if (error) {
			const erroresUnidos = error.details.map(err => err.message).join('\n'); // Unimos todos los mensajes de error en un solo string, separados por saltos de línea
			console.log(error.details.map(e => e.type));
			return res.status(400).json({ message: erroresUnidos });
		}


		// 3. Si pasa la validación, continuar con el servicio
		await agregarDispositivo(req.body);

		// 4. Éxito
		res.status(200).json({ message: 'Dispositivo agregado exitosamente' });

	} catch (error) {
		// 5. Errores inesperados del backend
		console.error('Error agregando dispositivo:', error);
		res.status(error.code || 500).json({ message: error.message || 'Error interno' });
	}
};

/* Actualizamos un dispositivo */
const updateDispositivo = async (req, res) => {
	try {
		await actualizarDispositivo(req.body);
		res.status(200).json({ message: 'Dispositivo actualizado exitosamente' });
	} catch (error) {
		console.error('Error actualizando dispositivo:', error);
		res.status(error.code || 500).json({ message: error.message || 'Error interno' });
	}
};

/* Eliminamos un dispositivo */
const deleteDispositivo = async (req, res) => {
	try {
		await eliminarDispositivo(req.body.id);
		res.status(200).json({ message: 'Dispositivo eliminado exitosamente' });
	} catch (error) {
		console.error('Error eliminando dispositivo:', error);
		res.status(error.code || 500).json({ message: error.message || 'Error interno' });
	}
};

/* Hacemos un ping a la ip */
const ping = async (req, res) => {
	try {
		const host = req.params.ip;
		const result = await pingHost(host);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error en ping:', error);
		res.status(500).json({ message: 'Error al hacer ping' });
	}
};

export const methods = {
	getDispositivos,
	postDispositivo,
	updateDispositivo,
	deleteDispositivo,
	ping
};