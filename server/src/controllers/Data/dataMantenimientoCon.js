/* CONTROLADORES DE LA INFORMACIÓN DE LOS MANTENIMIENTOS */
import { listarMantenimientos, publicarConstancia } from '../../services/Data/dataMantenimientoSer.js';
import { SchemaAgregarConstanciaMantenimiento } from '../../validators/Data/dataMantenimientoVal.js';

// Pedimos los datos de los mantenimientos de las sucursales
const getMantenimientos = async (req, res) => { // if (!req.session?.admin) 
	// if (req.session.hasOwnProperty('admin')) {
	try {
		const responsable = req.session.user;
		const tipo = req.session.tipo
		let result;
		result = await listarMantenimientos(responsable, tipo)
		res.status(200).json(result);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send("Error al obtener los datos");
	}
	// } else {
	// 	res.redirect('/')
	// }
};

// Agregar constancia de mantenimiento
const postConstancia = async (req, res) => {
	try {
		const { frealizada, descripcion = '', id } = req.body;
		const imagen = req.file.buffer; // Obtiene el archivo como un buffer
		const responsable = req.session.user;

		const { error } = SchemaAgregarConstanciaMantenimiento.validate(req.body, { abortEarly: false });
		if (error) {
			const erroresUnidos = error.details.map(err => err.message).join('\n');
			res.status(400).json({ message: erroresUnidos })
		}

		await publicarConstancia({ frealizada, descripcion, id, imagen, responsable })

		res.status(200).json({ message: 'Mantenimiento agregado exitosamente' }); // Responder con éxito

	} catch (error) {
		console.error('Error agregando nuevos datos:', error);
		res.status(error.status || 500).json({ message: error.message || 'Error agregando nuevos datos' }); // Responder con falla
	}
}

export const methods = {
	getMantenimientos, postConstancia
};