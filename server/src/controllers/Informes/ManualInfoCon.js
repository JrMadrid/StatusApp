/* CONTROLADORES DE INFORME -- MANUAL */
import sql from 'mssql'
import { obtenerDatosManual, obtenerArchivoManual } from '../../services/Informes/ManualInfoSer.js';

// Pide el id del manual
const verid = async (req, res) => {
	try {
		if (req.session.admin != undefined) {
			const vermanualid = req.params.id;
			req.session.vermanual = vermanualid;
			req.session.save(err => {
				if (err) {
					console.error('Error al guardar la sesión:', err);
				}
			});
		} else {
			res.redirect('');
		}
	} catch (error) {
		console.error('Error :', error);
	}
}

// Manda los datos del manual
const manualinfo = async (req, res) => {
	if (req.session.admin != undefined) {
		try {
			const manualid = req.session.vermanual;
			const manualinfo = await obtenerDatosManual(manualid);

			return res.status(200).json(manualinfo);

		} catch (error) {
			console.error('Error :', error);
		}
	} else {
		res.redirect('');
	}
};

// Manda el manual
const manual = async (req, res) => {
	if (req.session.admin != undefined) {
		try {
			const manualid = req.session.vermanual;
			let manualAr = await obtenerArchivoManual(manualid);

			res.set('Content-Type', 'application/pdf'); // Cambia el tipo de contenido a PDF
			res.set('Content-Disposition', `inline; filename="manual.pdf"`); // Cambia el nombre del archivo a descargar
			res.status(200).send(manualAr);

		} catch (error) {
			console.error('Error :', error);
			res.status(error.status || 500).json({ message: error.message || 'Error interno' }); // Responder con falla
		}
	} else {
		res.redirect('');
	}
};

export const methods = {
	verid, manualinfo, manual
};