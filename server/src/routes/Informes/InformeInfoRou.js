/* RUTAS DE INFORME -- INFORMES */
import express from 'express'
import { methods as InformeInfoControllers } from '../../controllers/Informes/InformeInfoCon.js';
const InformeInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

InformeInfoRou.get('/informes/verinforme/:id', InformeInfoControllers.verid); // Pide el id del informe --/informe/informes/verinforme/:id
InformeInfoRou.get('/informes/info', InformeInfoControllers.informeinfo); // Manda los datos del INFORME -- /informe/informes/info
InformeInfoRou.get('/informes/informe', InformeInfoControllers.informe); // Manda el INFORME -- /informe/informes/informe

export default InformeInfoRou;