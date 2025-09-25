/* RUTAS DE PANEL DE DISPOSITIVOS */
import express from 'express';
import { methods as panelDispositivosCon } from '../../controllers/Paneles/panelDispositivosCon.js';
import { requireAdminSession } from '../../../middlewares/controllersmid.js';
const panelAppsRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

// Middleware
panelAppsRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded
// panelAppsRou.use(requireAdminSession); // Verifica que sea administrador -- ocasiona error con los manuales e informes

panelAppsRou.get('/dispositivos', requireAdminSession, panelDispositivosCon.getDatosDispositivos); // Pedir los datos de los dispositivos -- /panel/dispositivos
panelAppsRou.post('/dispositivos/agregar', requireAdminSession, panelDispositivosCon.postDispositivo); // Agregar un nuevo dispositivo -- /panel/dispositivos/agregar
panelAppsRou.post('/dispositivos/actualizar', requireAdminSession, panelDispositivosCon.updateDispositivo); // Actualizar un dispositivo -- /panel/dispositivos/actualizar
panelAppsRou.post('/dispositivos/eliminar', requireAdminSession, panelDispositivosCon.deleteDispositivo); // Eliminar un dispositivo -- /panel/dispositivos/eliminar
panelAppsRou.get('/ping/:ip', requireAdminSession, panelDispositivosCon.ping); // Hacer ping a la ip -- /panel/ping/:ip

export default panelAppsRou;