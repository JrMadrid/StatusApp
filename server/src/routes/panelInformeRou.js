/* RUTAS DE PANEL DE INFORMES */
import express from 'express';
import multer from 'multer'; // Importa multer para manejar la subida de archivos
import { methods as panelInformeCon } from '../controllers/panelInformeCon.js';
const panelInformeRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
const upload = multer(); // Crea una instancia de multer para manejar la subida de archivos
panelInformeRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelInformeRou.get('/informes', panelInformeCon.getInformes); // Pedimos los datos de los informes -- /panel/informes
panelInformeRou.post('/informes/agregar', upload.single('informe'),  panelInformeCon.postInforme); // Agregamos un nuevo  INFORME -- upload.single('informe') es el nombre del campo del formulario que contiene el archivo -- /panel/informes/agregar
panelInformeRou.post('/informes/eliminar', panelInformeCon.deleteInforme); // Eliminamos un  INFORME -- /panel/informes/eliminar
panelInformeRou.get('/informe/:id', panelInformeCon.Informe); // Pedimos el informe en formato PDF -- /panel/informe/:id

export default panelInformeRou;