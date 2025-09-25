/* SERVICIOS DE INFORMATIVA -- INFORMES */
import { getInformeNombreDescripcion, getInformeArchivo } from '../../models/Informativas/InformeInfoMod.js';

// Mandar los datos del informe
export const obtenerInfoInforme = async (id) => {
  return await getInformeNombreDescripcion(id);
};

// Mandar el informe
export const obtenerArchivoInforme = async (id) => {
  return await getInformeArchivo(id);
};