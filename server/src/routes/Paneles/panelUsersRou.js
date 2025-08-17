/* RUTAS DE PANEL DE USUARIOS */
import express from 'express';
import { methods as panelUsersCon } from '../../controllers/Paneles/panelUsersCon.js';
import { requireAdminSession } from '../../middlewares/controllersmid.js';
const panelUserRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

// Middleware
panelUserRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded
// panelUserRou.use(requireAdminSession); // Verifica que sea administrador -- ocasiona error con los manuales e informes

panelUserRou.get('/users', requireAdminSession, panelUsersCon.getUsers); // Pedir los datos de los usuarios -- /panel/users
panelUserRou.post('/users/agregar', requireAdminSession, panelUsersCon.postUser); // Agregar un nuevo usuario -- /panel/users/agregar
panelUserRou.post('/users/actualizar', requireAdminSession, panelUsersCon.updateUser); // Actualizar un usuario -- /panel/users/actualizar
panelUserRou.post('/users/eliminar', requireAdminSession, panelUsersCon.deleteUser); // Eliminar un usuario -- /panel/users/eliminar
panelUserRou.get('/users/logoutall', requireAdminSession, panelUsersCon.logoutaAllUsers); // Cerrar la sesion de todos los usuarios -- /panel/users/logoutall

export default panelUserRou;