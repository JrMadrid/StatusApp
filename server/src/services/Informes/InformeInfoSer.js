/* SERVICIOS DE INFORME --  INFORMES */
import { getInformeNombreDescripcion, getInformeArchivo } from '../../models/Informes/InformeInfoMod.js';

export const obtenerInfoInforme = async (id) => {
    return await getInformeNombreDescripcion(id);
};

export const obtenerArchivoInforme = async (id) => {
    return await getInformeArchivo(id);
};