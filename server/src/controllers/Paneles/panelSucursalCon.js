/* CONTROLADORES DE PANEL DE SUCURSALES */
import { obtenerSucursales, agregarSucursal, actualizarSucursal, eliminarSucursal } from '../../services/Paneles/panelSucursalSer.js';
import { SchemaCrearSucursal, SchemaActualizarSucursal, SchemaEliminarSucursal } from '../../validators/Paneles/panelSucursalVar.js';

// Pedimos los datos de las sucursales
const getSucursales = async (req, res) => {
	try {
		const sucursales = await obtenerSucursales();
		res.status(200).json(sucursales);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send("Error al obtener los datos");
	}

};

// Agregamos una nueva sucursal
const postSucursal = async (req, res) => {
	try {
		const { economico, canal, nombre, ingresponsable, rellenar } = req.body;

		const { error/* , value */ } = SchemaCrearSucursal.validate(req.body, { abortEarly: false });
		if (error) {
			const mensajes = error.details.map(err => err.message).join('\n');
			return res.status(400).json({ message: mensajes });
		}

		await agregarSucursal(economico, canal, nombre, ingresponsable, rellenar);

		res.status(200).json({ message: 'Sucursal agregado exitosamente' });
	} catch (error) {
		console.error('Error agregando nuevos datos:', error);
		res.status(error.status || 500).json({ message: error.message || 'Error agregando nuevos datos' });
	}
};

// Actualizamos una sucursal
const updateSucursal = async (req, res) => {
	try {
		const { economico, canal, nombre, id, ingresponsable, rellenar } = req.body;

		const { error } = SchemaActualizarSucursal.validate(req.body, { abortEarly: false });

		if (error) {
			const mensajes = error.details.map(err => err.message).join('\n');
			return res.status(400).json({ message: mensajes });
		}

		await actualizarSucursal(economico, canal, nombre, id, ingresponsable, rellenar);
		res.status(200).json({ message: 'Sucursal actualizado exitosamente' });

	} catch (error) {
		console.error('Error actualizando datos:', error);
		res.status(error.status || 500).json({ message: error.message || 'Error actualizando datos' });
	}
};

// Eliminamos una sucursal
const deleteSucursal = async (req, res) => {
	try {
		const { id } = req.body;
		const { error } = SchemaEliminarSucursal.validate(req.body, { abortEarly: false });
		if (error) {
			const mensajes = error.details.map(err => err.message).join('\n');
			return res.status(400).json({ message: mensajes });
		}

		await eliminarSucursal(id);

		res.status(200).json({ message: 'Sucursal eliminada exitosamente' });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message || 'Error eliminando datos' });
		console.error('Error eliminando datos:', error);
	}
};

export const methods = {
	getSucursales,
	postSucursal,
	updateSucursal,
	deleteSucursal
};