/* RUTAS DE INFORMATIVA -- MANUAL */
import express from 'express'
import { methods as ManualInfoControllers } from '../../controllers/Informativas/ManualInfoCon.js';
const ManualInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

ManualInfoRou.get('/manuales/vermanual/:id', ManualInfoControllers.verid); // Pide el id del manual -- /informe/manuales/vermanual/:id
ManualInfoRou.get('/manuales/info', ManualInfoControllers.manualinfo); // Manda los datos del manual -- /informe/manuales/info
ManualInfoRou.get('/manuales/manual', ManualInfoControllers.manual); // Manda el manual -- /informe/manuales/manual

export default ManualInfoRou;