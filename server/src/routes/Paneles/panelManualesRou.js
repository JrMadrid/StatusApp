/* RUTAS DE PANEL DE MANUALES */
import express from 'express';
import multer from 'multer'; // Importa multer para manejar la subida de archivos
import { methods as panelManualCon } from '../../controllers/Paneles/panelManualesCon.js';
const panelManualesRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
const upload = multer(); // Configura multer para manejar la carga de archivos
panelManualesRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelManualesRou.get('/manuales', panelManualCon.getManuales); // Pedimos los datos de los manuales -- /panel/manuales
panelManualesRou.post('/manuales/agregar', upload.single('manual'),  panelManualCon.postManual); // Agregamos un nuevo manual -- upload.single('manual') es el nombre del campo del formulario que contiene el archivo -- /panel/manuales/agregar
panelManualesRou.post('/manuales/actualizar', panelManualCon.updateManual); // Actualizamos un manual -- /panel/manuales/actualizar
panelManualesRou.post('/manuales/eliminar', panelManualCon.deleteManual); // Eliminamos un manual -- /panel/manuales/eliminar
panelManualesRou.get('/manual/:id', panelManualCon.Manual); // Pedimos el manual en formato PDF -- /panel/manual/:id

export default panelManualesRou;