/* RUTAS DE INFORMATIVA -- SUCURSAL */
import express from 'express';
import { methods as SucursalInfoControllers } from '../../controllers/Informativas/SucursalInfoCon.js';
const SucursalInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

SucursalInfoRou.get('/status/numero/:economico', SucursalInfoControllers.economico); // Pide el número económico -- /informe/status/numero/:economico
SucursalInfoRou.get('/status/aplicaciones', SucursalInfoControllers.aplicaciones); // Consulta y retorna los dispositivos registrados por número económico -- /informe/status/aplicaciones
SucursalInfoRou.get('/status/aplicacion/:ip', SucursalInfoControllers.info); // Obtiene la información general de un dispositivo en específico por su IP -- /informe/status/aplicacion/:ip
SucursalInfoRou.get('/status/dispositivos', SucursalInfoControllers.dispositivos); // Recorre los dispositivos de una sucursal y actualiza la información si es necesario -- /informe/status/dispositivos
SucursalInfoRou.post('/status/aplicacion/solicitud', SucursalInfoControllers.solicitudes); // Enviar solicitudes o comandos al biométrico -- /informe/status/aplicacion/solicitud

export default SucursalInfoRou;