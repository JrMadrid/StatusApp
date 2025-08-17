/* RUTAS DE INFORMATIVA -- DISPOSITIVOS */
import express from 'express';
import { methods as DispositivosInfoControllers } from '../../controllers/Informativas/DispositivosInfoCon.js';
const DeviceInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

DeviceInfoRou.get('/devices/dispositivo/:nombre', DispositivosInfoControllers.nombre); // Recibir el nombre del dispositivo -- /informe/devices/dispositivo/:nombre
DeviceInfoRou.get('/devices/dispositivos', DispositivosInfoControllers.getDispositivosNombre); // Mandar los dispositivos con ese nombre -- /informe/devices/dispositivos
DeviceInfoRou.get('/devices/device/:dispo', DispositivosInfoControllers.getInfoDispositivos); // Pedir los datos de los dispositivos -- /informe/devices/device/:dispo

export default DeviceInfoRou;