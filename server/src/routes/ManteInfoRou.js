/* RUTAS DE INFORME -- MANTENIMIENTO */
import express from 'express';
import ManteInfoControllers from '../controllers/ManteInfoCon.js';
const ManteInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

ManteInfoRou.get('/numero/:economico', ManteInfoControllers.economico); // Pide el número economico -- /mantes/numero/:economico
ManteInfoRou.get('/fechas', ManteInfoControllers.fechasr); // Manda las fechas vinculadas al economico -- /mantes/fechas
ManteInfoRou.get('/sucursal/:fechasr', ManteInfoControllers.info); // Manda el archivo de la constancia de la fecha seleccionada -- /mantes/sucursal/:fechasr
ManteInfoRou.get('/constancias', ManteInfoControllers.infos); // Manda todas las constancias -- /mantes/constancias

export default ManteInfoRou;