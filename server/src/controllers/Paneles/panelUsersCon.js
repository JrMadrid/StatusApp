/* CONTROLADORES DE PANEL DE USUARIOS */
import { obtenerUsers, agregarUser, actualizarUser, eliminarUser, sacarAllUsers } from '../../services/Paneles/panelUsersSer.js';
import { SchemaCrearUsuario, SchemaActualizarUsuario, SchemaEliminarUsuario } from '../../validators/Paneles/PanelUsersVal.js';

const getUsers = async (req, res) => {
	try {
		let usuarios = await obtenerUsers();
		res.status(200).json(usuarios);

	} catch (error) {
		console.error('Error:', error);
		res.status(500).send("Error al obtener los datos");
	}
};

// Agregamos un nuevo usuario
const postUser = async (req, res) => {
	try {
		let { nickname, psw, tipo } = req.body;

		const { error } = SchemaCrearUsuario.validate(req.body, { abortEarly: false });

		if (error) {
			const mensajes = error.details.map(err => err.message).join('\n');
			return res.status(400).json({ message: mensajes });
		}

		await agregarUser(nickname, psw, tipo);
		res.status(200).json({ message: 'Usuario agregado exitosamente' })

	} catch (error) {
		console.error('Error agregando nuevos datos:', error);
		res.status(error.status || 500).json({ message: error.message || 'Error agregando nuevos datos' });
	}
};

// Actualizamos un usuario
const updateUser = async (req, res) => {
	try {
		let { nickname, psw, id, tipo } = req.body;

		const { error } = SchemaActualizarUsuario.validate(req.body, { abortEarly: false });

		if (error) {
			const mensajes = error.details.map(err => err.message).join('\n');
			return res.status(400).json({ message: mensajes });
		}

		await actualizarUser(nickname, psw, id, tipo);
		res.status(200).json({ message: 'Usuario actualizado exitosamente' });

	} catch (error) {
		console.error('Error actualizando datos:', error);
		res.status(error.status || 500).json({ message: error.message || 'Error actualizando datos' });
	}
};

// Eliminamos un usuario
const deleteUser = async (req, res) => {
	try {
		const { id } = req.body;
		const Super = req.session.user; // Nickname del Super Administrador para las sucursales del ing.Responsable eliminado
		const { error } = SchemaEliminarUsuario.validate(req.body, { abortEarly: false });

		if (error) {
			const mensajes = error.details.map(err => err.message).join('\n');
			return res.status(400).json({ message: mensajes });
		}

		await eliminarUser(id, Super);
		res.status(200).json({ message: 'Usuario eliminado exitosamente' });

	} catch (error) {
		res.status(error.status || 500).json({ message: error.message || 'Error eliminando datos' });
		console.error('Error eliminando datos:', error);
	}
}

// Cerramos la sesión de todos los usuarios
const logoutaAllUsers = async (req, res) => {
	try {
		await sacarAllUsers();
	} catch (error) {
		console.error('Error:', error);
	}
};

export const methods = {
	postUser,
	getUsers,
	updateUser,
	deleteUser,
	logoutaAllUsers
};