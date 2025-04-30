/* RUTAS DE PANEL DE SUCURSALES */
import express from 'express';
import { methods as panelSucursalCon } from '../controllers/panelSucursalCon.js';
const panelSucursalRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
panelSucursalRou.use(express.urlencoded({ extended: true })); // Configura el middleware para analizar los datos de formulario URL-encoded

panelSucursalRou.get('/sucursales', panelSucursalCon.getSucursales); // Pedimos los datos de las sucursales -- /panel/sucursales
panelSucursalRou.post('/sucursales/agregar', panelSucursalCon.postSucursal); // Agregamos una nueva sucursal -- /panel/sucursales/agregar
panelSucursalRou.post('/sucursales/actualizar', panelSucursalCon.patchSucursal); // Actualizamos una sucursal -- /panel/sucursales/actualizar
panelSucursalRou.post('/sucursales/eliminar', panelSucursalCon.deleteSucursal); // Eliminamos una sucursal -- /panel/sucursales/eliminar

export default panelSucursalRou;