/* RUTAS DE INFORMATIVA -- MANTENIMIENTO */
import express from 'express';
import ManteInfoControllers from '../../controllers/Informativas/ManteInfoCon.js';
const ManteInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

ManteInfoRou.get('/mantes/numero/:economico/:id', ManteInfoControllers.economico); // Pedir el número economico -- /informe/mantes/numero/:economico/:id
ManteInfoRou.get('/mantes/fecha', ManteInfoControllers.mantenimientoSeleccionado); // Mandar el documento del mantenimiento seleccionado -- /informe/mantes/fecha
ManteInfoRou.get('/mantes/fechas', ManteInfoControllers.fechasr); // Mandar las fechas vinculadas al economico -- /informe/mantes/fechas
ManteInfoRou.get('/mantes/sucursal/:fechasr', ManteInfoControllers.info); // Mandar el archivo de la constancia de la fecha seleccionada -- /informe/mantes/sucursal/:fechasr
ManteInfoRou.get('/mantes/constancias', ManteInfoControllers.infos); // Mandar todas las constancias -- /informe/mantes/constancias

export default ManteInfoRou;