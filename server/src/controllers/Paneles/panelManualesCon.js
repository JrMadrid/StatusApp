/* CONTROLADORES DE PANEL DE MANUALES */
import { obtenerManuales, publicarManual, eliminarManual, actualizarManual, manualArchivo } from '../../services/Paneles/panelManualSer.js';

// Pedimos los datos de los manuales
const getManuales = async (req, res) => {
	try {
		const manuales = await obtenerManuales();
		res.status(200).json(manuales);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send("Error al obtener los datos");
	}
};

// Agregamos un nuevo manual
const postManual = async (req, res) => {
	try {
		const { descripcion = '', nombre = '', documento } = req.body;
		const manual = req.file.buffer;
		await publicarManual(descripcion, nombre, documento, manual);
		res.status(200).json({ message: 'Manual agregado exitosamente' });

	} catch (error) {
		console.error('Error agregando nuevos datos:', error);
		res.status(500).json({ message: 'Error agregando nuevos datos' });
	}
};

// Eliminamos un manual
const deleteManual = async (req, res) => {
	try {
		const { id } = req.body;
		await eliminarManual(id);
		res.status(200).json({ message: 'Manual eliminado exitosamente' });
	} catch (error) {
		res.status(500).json({ message: 'Error eliminando datos' });
		console.error('Error al eliminar los datos', error);
	}
};

// Actualizamos un manual
const updateManual = async (req, res) => {
	try {
		const { nombre, descripcion, id } = req.body;
		await actualizarManual(nombre, descripcion, id);
		res.status(200).json({ message: 'Manual actualizado exitosamente' });
	} catch (error) {
		console.error('Error al actualizar los datos', error);
		res.status(error.status || 500).json({ message: error.message || 'Error actualizando datos' });
	}
};

// Pedimos el manual en formato PDF
const Manual = async (req, res) => {
	try {
		const id = req.params.id;
		const resultado = await manualArchivo(id);

		if (resultado.length > 0) {
			const archivo = resultado[0].manual;
			res.set('Content-Type', 'application/pdf'); // Cambia el tipo de contenido a PDF
			res.set('Content-Disposition', `inline; filename="manual.pdf"`); // Cambia el nombre del archivo si es necesario
			res.status(200).send(archivo);
		}
	} catch (error) {
		console.error('Error al comprobar el ID:', error);
		throw error;
	}
};

export const methods = {
	getManuales, postManual, updateManual, deleteManual, Manual
};