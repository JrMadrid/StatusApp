/* RUTAS DE PANEL DE DISPOSITIVOS */
import express from 'express';
import { methods as panelDispositivosCon } from '../../controllers/Paneles/panelDispositivosCon.js';
const panelAppsRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
panelAppsRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelAppsRou.get('/dispositivos', panelDispositivosCon.getDispositivos); // Pedimos los datos de los dispositivos -- /panel/dispositivos
panelAppsRou.post('/dispositivos/agregar', panelDispositivosCon.postDispositivo); // Agregamos un nuevo dispositivo -- /panel/dispositivos/agregar
panelAppsRou.post('/dispositivos/actualizar', panelDispositivosCon.updateDispositivo); // Actualizamos un dispositivo -- /panel/dispositivos/actualizar
panelAppsRou.post('/dispositivos/eliminar', panelDispositivosCon.deleteDispositivo); // Eliminamos un dispositivo -- /panel/dispositivos/eliminar
panelAppsRou.get('/ping/:ip', panelDispositivosCon.ping); // Hacemos un ping a la ip -- /apps/ping/:ip

export default panelAppsRou;