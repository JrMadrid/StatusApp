/* SERVICIOS PARA VALIDAR DATOS DE INFORMES */
import { getInformes, SucursalExiste } from "../../models/Paneles/panelInformeMod.js";

export const obtenerInformes = async (tipo, responsable) => {
  return await getInformes(tipo, responsable);
};

export const SucursalExisteSer = async (economico) => {
  return await SucursalExiste(economico);
}