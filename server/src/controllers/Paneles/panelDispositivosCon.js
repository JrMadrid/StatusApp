/* CONTROLADORES DE PANEL DE DISPOSITIVOS */
import { obtenerDatosDispositivos, agregarDispositivo, actualizarDispositivo, eliminarDispositivo } from '../../services/Paneles/panelDispositivosSer.js';
import { SchemaCrearDispositivo, SchemaActualizarDispositivo, SchemaEliminarDispositivo } from '../../validators/Paneles/panelDispositivosVal.js';
import pingHost from '../../connection/PING.js';

// Pedir los datos de los dispositivos
const getDatosDispositivos = async (req, res) => {
	try {
		const dispositivos = await obtenerDatosDispositivos();
		res.status(200).json(dispositivos);
	} catch (error) {
		console.error('Error: // Pedir los datos de los dispositivos, ', error);
		res.status(error?.code || 500).json({ message: error?.message || 'Error pidiendo los datos de los dispositivos' });
	}
};

// Agregar un nuevo dispositivo
const postDispositivo = async (req, res) => {
	try {
		// 1. Validar el body con Joi
		const { error } = SchemaCrearDispositivo.validate(req.body, { abortEarly: false }); // .validate sirve para validar el objeto y devuelve un objeto con error si hay problemas; abortEarly: false para obtener todos los errores, no solo el primero

		// 2. Si hay errores, devolverlos al frontend
		if (error) {
			const erroresUnidos = error.details.map(err => err.message).join('\n'); // Unimos todos los mensajes de error en un solo string, separados por saltos de línea
			// console.log(error.details.map(e => e.type)); // Esto imprime los tipos de error
			return res.status(400).json({ message: erroresUnidos });
		}

		// 3. Si pasa la validación, continuar con el servicio
		const { economico, ip, nombre, descripcion, general } = req.body
		await agregarDispositivo(economico, ip, nombre, descripcion, general);

		// 4. Éxito
		res.status(200).json({ message: 'Dispositivo agregado exitosamente' });

	} catch (error) {
		// 5. Errores inesperados del backend
		console.error('Error: // Agregar un nuevo dispositivo, ', error);
		res.status(error?.code || 500).json({ message: error?.message || 'Error agregando el dispositivo' });
	}
};

// Actualizar un dispositivo 
const updateDispositivo = async (req, res) => {
	try {
		// Validar el cuerpo del request con Joi
		const { error } = SchemaActualizarDispositivo.validate(req.body, { abortEarly: false });

		if (error) {
			// Si hay errores, los unimos en un solo mensaje
			const mensajes = error.details.map(err => err.message).join('\n');
			return res.status(400).json({ message: mensajes });
		}
		const { economico, ip, nombre, id, descripcion, general, reiniciar } = req.body;
		await actualizarDispositivo(economico, ip, nombre, id, descripcion, general, reiniciar);
		res.status(200).json({ message: 'Dispositivo actualizado exitosamente' });
	} catch (error) {
		console.error('Error: // Actualizar un dispositivo, ', error);
		res.status(error?.code || 500).json({ message: error?.message || 'Error actualizando los datos del dispositivo' });
	}
};

// Eliminar un dispositivo
const deleteDispositivo = async (req, res) => {
	try {
		// Validar el cuerpo del request con Joi
		const { error } = SchemaEliminarDispositivo.validate(req.body, { abortEarly: false });

		if (error) {
			// Si hay errores, los unimos en un solo mensaje
			const mensajes = error.details.map(err => err.message).join('\n');
			return res.status(400).json({ message: mensajes });
		}
		const { id } = req.body;
		await eliminarDispositivo(id);
		res.status(200).json({ message: 'Dispositivo eliminado exitosamente' });
	} catch (error) {
		console.error('Error: // Eliminar un dispositivo, ', error);
		res.status(error?.code || 500).json({ message: error?.message || 'Error eliminando el dispositivo' });
	}
};

// Hacer un ping a la ip 
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

export const methods = { getDatosDispositivos, postDispositivo, updateDispositivo, deleteDispositivo, ping };