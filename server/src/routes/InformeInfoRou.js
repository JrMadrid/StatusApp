/* RUTAS DE INFORME -- INFORMES */
import express from 'express'
import { methods as InformeInfoControllers } from '../controllers/InformeInfoCon.js';
const InformeInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

InformeInfoRou.get('/verinforme/:id', InformeInfoControllers.verid); // Pide el id del informe --/informes/verinforme/:id
InformeInfoRou.get('/info', InformeInfoControllers.informeinfo); // Manda los datos del  INFORME -- /informes/info
InformeInfoRou.get('/informe', InformeInfoControllers.informe); // Manda el  INFORME -- /informes/informe

export default InformeInfoRou;