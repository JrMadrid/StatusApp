/* RUTAS DE INFORMATIVA -- SUCURSAL */
import express from 'express';
import { methods as SucursalInfoControllers } from '../../controllers/Informativas/SucursalInfoCon.js';
const SucursalInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

SucursalInfoRou.get('/status/numero/:economico', SucursalInfoControllers.economico); // Pedir el número económico -- /informe/status/numero/:economico
SucursalInfoRou.get('/status/aplicaciones', SucursalInfoControllers.getSucursalDispositivos); // Consultar y retornar los dispositivos registrados por número económico -- /informe/status/aplicaciones
SucursalInfoRou.get('/status/aplicacion/:ip', SucursalInfoControllers.info); // Obtener la información general de un dispositivo en específico por su IP -- /informe/status/aplicacion/:ip
SucursalInfoRou.get('/status/dispositivos', SucursalInfoControllers.dispositivos); // Recorrer los dispositivos de una sucursal y actualizar la información si es necesario -- /informe/status/dispositivos
SucursalInfoRou.post('/status/aplicacion/solicitud', SucursalInfoControllers.solicitudes); // Enviar solicitudes o comandos al biométrico -- /informe/status/aplicacion/solicitud

export default SucursalInfoRou;