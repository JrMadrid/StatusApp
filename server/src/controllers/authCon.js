/* CONTROLADORES DE AUTENTICACIÓN DE USUARIOS */
import { loginService, definirTipoUsuario } from '../services/authSer.js';

// Leer y comprobar el usuario
const login = async (req, res) => {
	try {
		const { nickname, psw } = req.body;
		const { usuario, admon, tipo, error } = await loginService(nickname, psw);

		if (error) {
			return res.status(401).send({ error });
		}

		req.session.admin = admon;
		req.session.user = usuario;
		req.session.login = req.session.user ? true : false; // Se ha iniciado sesión correctamente		
		
		req.session.tipo = tipo.trim();

		req.session.save(err => {
			if (err) {
				console.error('Error al guardar la sesión:', err);
				return res.status(500).send({ error: 'Error al guardar sesión' });
			}
			res.status(200).send({ admin: admon });
		});

	} catch (error) {
		console.error('Error en login:', error);
		res.status(500).send({ error: 'Error en login' });
	}
};

const user = async (req, res) => {
	const userInfo = definirTipoUsuario(req.session);
	res.json(userInfo);
};

const logout = async (req, res) => {
	console.log('Sesión destruida');
	await req.session.destroy();
	const cierre = !req.session ? true : false;
	res.status(200).json(cierre);
};

export const methods = { login, logout, user };