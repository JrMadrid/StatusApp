/* RUTAS DE PANEL DE USUARIOS */
import express from 'express';
import { methods as panelUsersCon } from '../controllers/panelUsersCon.js';
const panelUserRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
panelUserRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelUserRou.get('/users', panelUsersCon.getUsers); // Pedimos los datos de los usuarios -- /panel/users
panelUserRou.post('/users/agregar', panelUsersCon.postUser); // Agregamos un nuevo usuario -- /panel/users/agregar
panelUserRou.post('/users/actualizar', panelUsersCon.patchUser); // Actualizamos un usuario -- /panel/users/actualizar
panelUserRou.post('/users/eliminar', panelUsersCon.deleteUser); // Eliminamos un usuario -- /panel/users/eliminar
panelUserRou.get('/users/logoutall', panelUsersCon.logoutaAllUsers); // Cerramos la sesion de todos los usuarios -- /panel/users/logoutall

export default panelUserRou;