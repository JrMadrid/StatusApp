/* CONTROLADORES DE AUTENTICACIÓN DE USUARIOS */
import { loginService, definirTipoUsuario } from '../services/authSer.js';

// Leer y comprobar el usuario
const login = async (req, res) => {
	try {
		const { nickname, psw } = req.body;
		const { usuario, admon, tipo, error } = await loginService(nickname, psw);

		if (error) {
			return res.status(401).json({ error });
		}

		req.session.admin = admon;
		req.session.user = usuario;
		req.session.login = req.session.user ? true : false; // Se ha iniciado sesión correctamente		

		req.session.tipo = tipo.trim();
		if (tipo !== "Super Administrador") {
			req.session.perfil = usuario;
		}

		req.session.save(err => {
			if (err) {
				console.error('Error al guardar la sesión:', err);
				return res.status(500).json({ error: 'Error al guardar sesión' });
			}
			res.status(200).json({ admin: admon });
		});

	} catch (error) {
		console.error('Error:  // Leer y comprobar el usuario, ', error);
		res.status(500).json({ error: 'Error en login' });
	}
};

// Definir el tipo de usuario
const user = async (req, res) => {
	const userInfo = definirTipoUsuario(req.session);
	res.status(200).json(userInfo);
};

// Cerrar sesión
const logout = async (req, res) => {
	console.log('Sesión destruida');
	await req.session.destroy();
	const cierre = !req.session ? true : false;
	res.status(200).json(cierre);
};

export const methods = { login, logout, user };