/* RUTAS DE INFORME -- SUCURSAL */
import express from 'express'
import { methods as infoControllers } from '../controllers/AppInfoCon.js';
const infoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

infoRou.get('/numero/:economico', infoControllers.economico); // Pide el número económico -- /status/numero/:economico
infoRou.get('/aplicaciones', infoControllers.aplicaciones); // Consulta y retorna los dispositivos registrados por número económico -- /status/aplicaciones
infoRou.get('/aplicacion/:ip', infoControllers.info); // Obtiene la información general de un dispositivo en específico por su IP -- /status/aplicacion/:ip
infoRou.get('/dispositivos', infoControllers.dispositivos); // Recorre los dispositivos de una sucursal y actualiza la información si es necesario -- /status/dispositivos
infoRou.post('/aplicacion/solicitud', infoControllers.solicitudes); // Enviar solicitudes o comandos al biométrico -- /status/aplicacion/solicitud

export default infoRou;