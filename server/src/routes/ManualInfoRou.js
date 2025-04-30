/* RUTAS DE INFORME -- MANUAL */
import express from 'express'
import { methods as ManualInfoControllers } from '../controllers/ManualInfoCon.js';
const ManualInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

ManualInfoRou.get('/vermanual/:id', ManualInfoControllers.verid); // Pide el id del manual -- /manuales/vermanual/:id
ManualInfoRou.get('/info', ManualInfoControllers.manualinfo); // Manda los datos del manual -- /manuales/info
ManualInfoRou.get('/manual', ManualInfoControllers.manual); // Manda el manual -- /manuales/manual

export default ManualInfoRou;