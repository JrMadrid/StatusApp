/* SERVIDORES DE INFORME -- MANUAL */
import { getDatosManual, getManualArchivo } from "../../models/Informes/ManualInfoMod.js";

export const obtenerDatosManual = async (manualid) => {
  return await getDatosManual(manualid);
};

export const obtenerArchivoManual = async (manualid) => {
  const manualArchivo = await getManualArchivo(manualid);
  if (manualArchivo.length > 0) {
    const archivo = manualArchivo[0].manual;

    return (archivo);
  } else {
    throw { status: 404, message: 'Archivo no encontrado' };
  }
};