/* CONTROLADORES DE INFORME -- MANTENIMIENTO */
import { fechasMantenimientosRealizados, obtenerArchivoMantenimiento, obtenerArchivosMantenimientos } from '../../services/Informes/ManteInfoSer.js';

// Manda las fechas vinculadas al economico
const economico = async (req, res) => {
	try {
		if (req.session.admin != undefined) {
			const numero = req.params.economico;
			req.session.numeroMante = numero;
			req.session.save(err => {
				if (err) {
					console.error('Error al guardar el numero economico:', err);
				}
			});
		} else {
			res.redirect('');
		}
	} catch (error) {
		console.error('Error :', error);
	}
};

// Manda las fechas vinculadas al economico
const fechasr = async (req, res) => {
	if (req.session.admin != undefined) {
		try {
			const economico = req.session.numeroMante;
			const fechasr = await fechasMantenimientosRealizados(economico)

			return res.status(200).json(fechasr);

		} catch (error) {
			console.error('Error :', error);
		}
	} else {
		res.redirect('');
	}
};

// Manda el archivo de la constancia de la fecha seleccionada
const info = async (req, res) => {
	if (req.session.admin != undefined) {
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
	} else {
		res.redirect('');
	}
};

// Manda todas las constancias
const infos = async (req, res) => {
	if (req.session.admin != undefined) {
		try {
			const economico = req.session.numeroMante;
			const constancias = await obtenerArchivosMantenimientos(economico);
			
			res.status(200).json(constancias);

		} catch (error) {
			console.error('Error:', error);
			res.status(error.status || 500).send({ message: error.message || 'Error interno' });
		}
	} else {
		res.redirect('');
	}
};

export default {
	economico, fechasr, info, infos
};