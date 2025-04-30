/* RUTAS DE LA INFORMACIÓN DE LAS SUCURSALES */
import express from 'express';
import getSucursales from '../controllers/dataSucursalCon.js'
const dataSucursalRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

dataSucursalRou.get('/sucursales', getSucursales); // Pedimos los datos de las sucursales -- /api/sucursales

export default dataSucursalRou;