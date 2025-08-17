/* CONTROLADORES DE PANEL DE USUARIOS */
import { obtenerUsers, agregarUser, actualizarUser, eliminarUser, sacarAllUsers } from '../../services/Paneles/panelUsersSer.js';
import { SchemaCrearUsuario, SchemaActualizarUsuario, SchemaEliminarUsuario } from '../../validators/Paneles/PanelUsersVal.js';

// Pedir los datos de los usuarios
const getUsers = async (req, res) => {
	try {
		let usuarios = await obtenerUsers();
		res.status(200).json(usuarios);
	} catch (error) {
		console.error('Error: // Pedir los datos de los usuarios, ', error);
		res.status(error?.code || 500).json({ message: error?.message || "Error pidiendo los datos de los usuarios" });
	}
};

// Agregar un nuevo usuario
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
		console.error('Error: // Agregar un nuevo usuario, ', error);
		res.status(error?.code || 500).json({ message: error?.message || 'Error agregando usuario' });
	}
};

// Actualizar un usuario
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
		console.error('Error: // Actualizar un usuario, ', error);
		res.status(error?.code || 500).json({ message: error?.message || 'Error actualizando usuario' });
	}
};

// Eliminar un usuario
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
		console.error('Error: // Eliminar un usuario, ', error);
		res.status(error?.code || 500).json({ message: error?.message || 'Error eliminando usuario' });
	}
}

// Cerrar la sesión de todos los usuarios
const logoutaAllUsers = async (req, res) => {
	try {
		await sacarAllUsers();
		res.sendStatus(200);
	} catch (error) {
		console.error('Error: // Cerrar la sesión de todos los usuarios, ', error);
		res.sendStatus(500);
	}
};

export const methods = { postUser, getUsers, updateUser, deleteUser, logoutaAllUsers };