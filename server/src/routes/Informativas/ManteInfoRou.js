/* RUTAS DE INFORMATIVA -- MANTENIMIENTO */
import express from 'express';
import ManteInfoControllers from '../../controllers/Informativas/ManteInfoCon.js';
const ManteInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

ManteInfoRou.get('/mantes/numero/:economico', ManteInfoControllers.economico); // Pide el número economico -- /informe/mantes/numero/:economico
ManteInfoRou.get('/mantes/fechas', ManteInfoControllers.fechasr); // Manda las fechas vinculadas al economico -- /informe/mantes/fechas
ManteInfoRou.get('/mantes/sucursal/:fechasr', ManteInfoControllers.info); // Manda el archivo de la constancia de la fecha seleccionada -- /informe/mantes/sucursal/:fechasr
ManteInfoRou.get('/mantes/constancias', ManteInfoControllers.infos); // Manda todas las constancias -- /informe/mantes/constancias

export default ManteInfoRou;