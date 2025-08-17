/* RUTAS DE AUTENTICACIÓN DE USUARIOS */
import express from 'express'
import { methods as authControllers } from '../controllers/authCon.js';
const authRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

authRou.use(express.urlencoded({ extended: true })); // Middleware para parsear el cuerpo de las solicitudes
authRou.post('/login/user', authControllers.login); // Leer y comprobar el usuario -- /auth/login/user
authRou.get('/api/user', authControllers.user); // Definir el tipo de usuario -- /auth/api/user
authRou.get('/out', authControllers.logout); // Cerrar sesión -- /auth/out

export default authRou;