/* RUTAS DE PANEL DE MANTENIMIENTOS */
import express from 'express';
import { methods as panelMantenimientoCon } from '../../controllers/Paneles/panelMantenimientoCon.js';
import { requireUserSession, requireAdminSession } from '../../middlewares/controllersmid.js';
const panelMantenimientoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

// Middleware
panelMantenimientoRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelMantenimientoRou.get('/mantenimientos', requireUserSession, panelMantenimientoCon.getMantenimientos); // Pedimos los datos de los mantenimientos -- /panel/mantenimientos
panelMantenimientoRou.post('/mantenimientos/agregar', requireAdminSession, panelMantenimientoCon.postMantenimientos); // Agregamos un nuevo mantenimiento -- upload.single('imagen') es el nombre del campo del formulario que contiene el archivo -- /panel/mantenimientos/agregar
panelMantenimientoRou.post('/mantenimientos/eliminar', requireAdminSession, panelMantenimientoCon.deleteMantenimiento); // Eliminamos un mantenimiento -- /panel/mantenimientos/eliminar

export default panelMantenimientoRou;