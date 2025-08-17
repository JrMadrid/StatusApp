/* RUTAS DE PANEL DE MANTENIMIENTOS */
import express from 'express';
import { requireUserSession, requireAdminSession } from '../../middlewares/controllersmid.js';
import { methods as panelMantenimientoCon } from '../../controllers/Paneles/panelMantenimientoCon.js';
const panelMantenimientoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

// Middleware
panelMantenimientoRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelMantenimientoRou.get('/mantenimientos', requireUserSession, panelMantenimientoCon.getMantenimientos); // Pedir los datos de los mantenimientos -- /panel/mantenimientos
panelMantenimientoRou.post('/mantenimientos/agregar', requireAdminSession, panelMantenimientoCon.postMantenimientos); // Agregar un nuevo mantenimiento -- upload.single('imagen') es el nombre del campo del formulario que contiene el archivo -- /panel/mantenimientos/agregar
panelMantenimientoRou.post('/mantenimientos/eliminar', requireAdminSession, panelMantenimientoCon.deleteMantenimiento); // Eliminar un mantenimiento -- /panel/mantenimientos/eliminar

export default panelMantenimientoRou;