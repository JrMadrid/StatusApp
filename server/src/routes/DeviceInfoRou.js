/* RUTAS DE INFORME -- DISPOSITIVOS */
import express from 'express'
import { methods as DeviceInfoControllers } from '../controllers/DeviceInfoCon.js';
const DeviceInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

DeviceInfoRou.get('/dispositivo/:nombre', DeviceInfoControllers.nombre); // Pide el nombre -- /devices/dispositivo/:nombre
DeviceInfoRou.get('/dispositivos', DeviceInfoControllers.dispositivos); // Manda los dispositivos con ese nombre -- /devices/dispositivos
DeviceInfoRou.get('/device/:dispo', DeviceInfoControllers.info); // Consulta para los datos de los dispositivos -- /devices/device/:dispo

export default DeviceInfoRou;