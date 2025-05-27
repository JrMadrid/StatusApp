/* RUTAS DE INFORME -- DISPOSITIVOS */
import express from 'express';
import { methods as DispositivosInfoControllers } from '../../controllers/Informes/DispositivosInfoCon.js';
const DeviceInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

DeviceInfoRou.get('/devices/dispositivo/:nombre', DispositivosInfoControllers.nombre); // Pide el nombre -- /informe/devices/dispositivo/:nombre
DeviceInfoRou.get('/devices/dispositivos', DispositivosInfoControllers.dispositivos); // Manda los dispositivos con ese nombre -- /informe/devices/dispositivos
DeviceInfoRou.get('/devices/device/:dispo', DispositivosInfoControllers.info); // Consulta para los datos de los dispositivos -- /informe/devices/device/:dispo

export default DeviceInfoRou;