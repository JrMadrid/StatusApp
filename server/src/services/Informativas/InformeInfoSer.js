/* SERVICIOS DE INFORMATIVA -- INFORMES */
import { getInformeNombreDescripcion, getInformeArchivo } from '../../models/Informativas/InformeInfoMod.js';

export const obtenerInfoInforme = async (id) => {
	return await getInformeNombreDescripcion(id);
};

export const obtenerArchivoInforme = async (id) => {
	return await getInformeArchivo(id);
};