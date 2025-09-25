/* RUTAS DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import express from 'express';
import { methods as dataDispositivosCon } from '../../controllers/Data/dataDispositivosCon.js';
const dataDispositivosRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

dataDispositivosRou.get('/dispositivos', dataDispositivosCon.getDatosDispositivos); // Pedir los datos de los dispositivos -- /api/dispositivos
dataDispositivosRou.get('/dispos', dataDispositivosCon.getListaDispositivos); // Pedir la lista de los dispositivos -- /api/dispos

export default dataDispositivosRou;