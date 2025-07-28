/* CONTROLADORES DE INFORMATIVA -- MANTENIMIENTO */
import { fechaMantenimientoSeleccionado, fechasMantenimientosRealizados, obtenerArchivoMantenimiento, obtenerArchivosMantenimientos } from '../../services/Informativas/ManteInfoSer.js';

// Manda las fechas vinculadas al economico y 
const economico = async (req, res) => {
	try {
		const numero = req.params.economico;
		const id = req.params.id;

		req.session.numeroMante = numero;
		req.session.numeroManteid = id;

		req.session.save(err => {
			if (err) {
				console.error('Error al guardar el numero economico:', err);
			}
		});
	} catch (error) {
		console.error('Error :', error);
	}
};

// Manda el documento del mantemiento seleccionado
const mantenimientoSeleccionado = async (req, res) => {
	try {
		const id = req.session.numeroManteid;
		const mantenimiento = await fechaMantenimientoSeleccionado(id);
		res.set('Content-Type', 'image/jpeg'); // Cambia el tipo de contenido a JPEG
		res.set('Content-Disposition', `inline; filename="constancia.jpg"`); // Cambia el nombre del archivo a descargar
		res.status(200).send(mantenimiento);

	} catch (error) {
		console.error('Error :', error);
	}
}

// Manda las fechas vinculadas al economico
const fechasr = async (req, res) => {
	try {
		const economico = req.session.numeroMante;
		const id = req.session.numeroManteid;

		const fechasr = await fechasMantenimientosRealizados(economico)

		return res.status(200).json(fechasr);

	} catch (error) {
		console.error('Error :', error);
	}
};

// Manda el archivo de la constancia de la fecha seleccionada
const info = async (req, res) => {
	try {
		const fechasr = req.params.fechasr;

		if (fechasr && fechasr !== null && fechasr !== 'null') {
			const economico = req.session.numeroMante;
			const constanciaArchivo = await obtenerArchivoMantenimiento(fechasr, economico);
			res.set('Content-Type', 'image/jpeg'); // Cambia el tipo de contenido a JPEG
			res.set('Content-Disposition', `inline; filename="constancia.jpg"`); // Cambia el nombre del archivo a descargar
			res.status(200).send(constanciaArchivo);

		} else {
			return res.status(400).json({ message: 'Fecha no valida' });
		}
	} catch (error) {
		console.error('Error:', error);
		res.status(error.status || 500).json({ message: error.message || 'Error interno' }); // Responder con falla
	}
};

// Manda todas las constancias
const infos = async (req, res) => {
	try {
		const economico = req.session.numeroMante;
		const constancias = await obtenerArchivosMantenimientos(economico);

		res.status(200).json(constancias);

	} catch (error) {
		console.error('Error:', error);
		res.status(error.status || 500).send({ message: error.message || 'Error interno' });
	}
};

export default {
	economico, mantenimientoSeleccionado, fechasr, info, infos
};