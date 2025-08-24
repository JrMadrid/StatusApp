/* SERVICIOS DE INFORMATIVA -- MANUAL */
import { getDatosManual, getManualArchivo } from "../../models/Informativas/ManualInfoMod.js";

// Mandar los datos del manual
export const obtenerDatosManual = async (manualid) => {
  return await getDatosManual(manualid);
};

// Mandar el manual
export const obtenerArchivoManual = async (manualid) => {
  return await getManualArchivo(manualid);
};