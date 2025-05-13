/* CONTROLADORES DE PANEL DE USUARIOS */
import { obtenerUsers, agregarUser, actualizarUser, eliminarUser, sacarAllUsers } from '../../services/Paneles/panelUsersSer.js';

const getUsers = async (req, res) => {
	if (req.session.admin) {
		try {
			let usuarios = await obtenerUsers();
			res.status(200).json(usuarios);

		} catch (error) {
			console.error('Error:', error);
			res.status(500).send("Error al obtener los datos");
		}
	} else {
		res.redirect('');
	}
};

// Agregamos un nuevo usuario
const postUser = async (req, res) => {
	if (req.session.admin) {
		try {
			let { nickname, psw, tipo } = req.body;

			await agregarUser(nickname, psw, tipo);
			res.status(200).json({ message: 'Usuario agregado exitosamente' })

		} catch (error) {
			console.error('Error agregando nuevos datos:', error);
			res.status(error.status || 500).json({ message: error.message || 'Error agregando nuevos datos' });
		}
	} else {
		res.redirect('');
	}
};

// Actualizamos un usuario
const updateUser = async (req, res) => {
	if (req.session.admin) {
		try {
			let { nickname, psw, id, tipo } = req.body;

			await actualizarUser(nickname, psw, id, tipo);
			res.status(200).json({ message: 'Usuario actualizado exitosamente' });

		} catch (error) {
			console.error('Error actualizando datos:', error);
			res.status(error.status || 500).json({ message: error.message || 'Error actualizando datos' });
		}
	} else {
		res.redirect('');
	}
};

// Eliminamos un usuario
const deleteUser = async (req, res) => {
	if (req.session.admin) {
		try {
			const { id } = req.body;

			await eliminarUser(id);
			res.status(200).json({ message: 'Usuario eliminado exitosamente' });

		} catch (error) {
			res.status(error.status || 500).json({ message: error.message || 'Error eliminando datos' });
			console.error('Error eliminando datos:', error);
		}
	} else {
		res.redirect('');
	}
}

// Cerramos la sesión de todos los usuarios
const logoutaAllUsers = async (req, res) => {
	if (req.session.admin) {
		try {
			await sacarAllUsers();
		} catch (error) {
			console.error('Error:', error);
		}
	} else {
		res.redirect('');
	}
};

export const methods = {
	postUser,
	getUsers,
	updateUser,
	deleteUser,
	logoutaAllUsers
};