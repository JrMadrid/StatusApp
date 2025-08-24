/* RUTAS DE LA INFORMACIÓN DE LAS MANTENIMIENTOS */
import express from 'express';
import multer from 'multer'; // Middleware para manejar multipart/form-data
import { methods as panelConstanciaCon } from '../../controllers/Data/dataMantenimientoCon.js';
const dataMantenimientoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
const upload = multer(); // Almacena los archivos en memoria

dataMantenimientoRou.use(express.urlencoded({ extended: true })); // Middleware para parsear el cuerpo de las solicitudes 

dataMantenimientoRou.get('/mantenimientos', panelConstanciaCon.getMantenimientos); // Pedir los datos de los mantenimientos de las sucursales -- /api/mantenimientos
dataMantenimientoRou.post('/mantenimientos/agregar', upload.single('imagen'), panelConstanciaCon.postConstancia); // Agregar constancia de mantenimiento -- /api/mantenimientos/agregar

export default dataMantenimientoRou;