/* RUTAS DE PANEL DE DISPOSITIVOS */
import express from 'express';
import { methods as panelAppsCon } from '../controllers/panelAppsCon.js';
const panelAppsRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
panelAppsRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelAppsRou.get('/dispositivos', panelAppsCon.getApps); // Pedimos los datos de los dispositivos -- /apps/dispositivos
panelAppsRou.post('/dispositivos/agregar', panelAppsCon.postApp); // Agregamos un nuevo dispositivo -- /apps/dispositivos/agregar
panelAppsRou.post('/dispositivos/actualizar', panelAppsCon.patchApp); // Actualizamos un dispositivo -- /apps/dispositivos/actualizar
panelAppsRou.post('/dispositivos/eliminar', panelAppsCon.deleteApp); // Eliminamos un dispositivo -- /apps/dispositivos/eliminar
panelAppsRou.get('/ping/:ip', panelAppsCon.ping); // Hacemos un ping a la ip -- /apps/ping/:ip

export default panelAppsRou;