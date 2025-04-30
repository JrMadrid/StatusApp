/* RUTAS DE PANEL DE MANTENIMIENTOS */
import express from 'express';
import multer from 'multer'; // Importa multer para manejar la subida de archivos
import { methods as panelMantenimientoCon } from '../controllers/panelMantenimientoCon.js';
const panelMantenimientoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
const upload = multer(); // Configura multer para manejar la carga de archivos
panelMantenimientoRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelMantenimientoRou.get('/mantenimientos', panelMantenimientoCon.getMantenimientos); // Pedimos los datos de los mantenimientos -- /panel/mantenimientos
panelMantenimientoRou.post('/mantenimientos/agregar', upload.single('imagen'),  panelMantenimientoCon.postMantenimientos); // Agregamos un nuevo mantenimiento -- upload.single('imagen') es el nombre del campo del formulario que contiene el archivo -- /panel/mantenimientos/agregar
panelMantenimientoRou.post('/mantenimientos/eliminar', panelMantenimientoCon.deleteMantenimiento); // Eliminamos un mantenimiento -- /panel/mantenimientos/eliminar

export default panelMantenimientoRou;