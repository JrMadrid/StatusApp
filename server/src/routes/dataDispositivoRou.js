/* RUTAS DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import express from 'express';
import {methods as dataAplicacionCon} from '../controllers/dataAplicacionCon.js'
const dataAplicacionRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

dataAplicacionRou.get('/aplicaciones', dataAplicacionCon.getDispositivos); // Pedimos los datos de las aplicaciones -- /api/aplicaciones
dataAplicacionRou.get('/dispos', dataAplicacionCon.getListaDispositivos); // Pedimnos la lista de los dispositivos -- /api/dispos

export default dataAplicacionRou;