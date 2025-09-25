/* RUTAS DE PANEL DE INFORMES */
import express from 'express';
import multer from 'multer'; // Importa multer para manejar la subida de archivos
import { methods as panelInformeCon } from '../../controllers/Paneles/panelInformeCon.js';
import { requireUserSession, requireAdminSession } from '../../../middlewares/controllersmid.js';
const panelInformeRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
const upload = multer(); // Crea una instancia de multer para manejar la subida de archivos

// Middleware
panelInformeRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelInformeRou.get('/informes', requireUserSession, panelInformeCon.getInformes); // Pedir los datos de los informes -- /panel/informes
panelInformeRou.post('/informes/agregar', requireUserSession, upload.single('informe'), panelInformeCon.postInforme); // Agregar un nuevo informe -- upload.single('informe') es el nombre del campo del formulario que contiene el archivo -- /panel/informes/agregar
panelInformeRou.post('/informes/eliminar', requireAdminSession, panelInformeCon.deleteInforme); // Eliminar un informe -- /panel/informes/eliminar
panelInformeRou.get('/informe/:id', requireUserSession, panelInformeCon.Informe); // Pedir el informe en formato PDF -- /panel/informe/:id

export default panelInformeRou;