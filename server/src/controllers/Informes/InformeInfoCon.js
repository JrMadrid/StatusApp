/* CONTROLADORES DE INFORME --  INFORMES */
import { obtenerInfoInforme, obtenerArchivoInforme } from '../../services/Informes/InformeInfoSer.js';

// Pide el id del informe
const verid = async (req, res) => {
	try {
		req.session.verinforme = req.params.id;
		req.session.save(err => {
			if (err) console.error('Error al guardar la sesión:', err);
		});

	} catch (error) {
		console.error('Error :', error);
	}
};

// Manda los datos del informe
const informeinfo = async (req, res) => {
	try {
		const datos = await obtenerInfoInforme(req.session.verinforme);
		res.status(200).json(datos);
	} catch (error) {
		console.error('Error :', error);
	}
};

// Manda el informe
const informe = async (req, res) => {
	try {
		const result = await obtenerArchivoInforme(req.session.verinforme);

		if (result.length > 0) {
			res.set('Content-Type', 'application/pdf');
			res.set('Content-Disposition', `inline; filename="informe.pdf"`);
			res.status(200).send(result[0].informe);
		} else {
			res.status(404).json({ message: 'Archivo no encontrado' });
		}
	} catch (error) {
		console.error('Error :', error);
	}
};

export const methods = {
	verid, informeinfo, informe
};