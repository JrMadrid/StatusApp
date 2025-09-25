/* RUTAS DE INFORMATIVA -- INFORMES */
import express from 'express';
import { methods as InformeInfoControllers } from '../../controllers/Informativas/InformeInfoCon.js';
const InformeInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

InformeInfoRou.get('/informes/verinforme/:id', InformeInfoControllers.verid); // Pedir el id del informe --/informe/informes/verinforme/:id
InformeInfoRou.get('/informes/info', InformeInfoControllers.informeinfo); // Mandar los datos del informe -- /informe/informes/info
InformeInfoRou.get('/informes/informe', InformeInfoControllers.informe); // Mandar el informe -- /informe/informes/informe

export default InformeInfoRou;