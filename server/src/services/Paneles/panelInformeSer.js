/* SERVICIOS PARA VALIDAR DATOS DE INFORMES */
import { getInformes, SucursalExiste, SucursalPerteneciente, postInforme, deleteInforme, comprobarID, informeArchivo } from "../../models/Paneles/panelInformeMod.js";

export const obtenerInformes = async (tipo, responsable) => {
  return await getInformes(tipo, responsable);
};

export const SucursalExisteSer = async (economico) => {
  return await SucursalExiste(economico);
};

export const SucursaPerteneceSer = async (economico, ingeniero) => {
  return await SucursalPerteneciente(economico, ingeniero);
};

export const publicarInforme = async (descripcion, nombre, documento, frealizada, economico, informe, ingeniero) => {
  const isEconomicoValid = await SucursalExisteSer(economico)
  if (!isEconomicoValid) {
    throw { status: 404, message: 'No se encontro la sucursal (economico no valido)' };
  }
  const lePertenece = await SucursaPerteneceSer(economico, ingeniero)
  if (!lePertenece) {
    throw { status: 404, message: 'No es su sucursal (economico no valido)' };
  }
  await postInforme(descripcion, nombre, documento, frealizada, economico, informe);
};

export const eliminarInforme = async (id) => {
  const IdExiste = await comprobarID(id)
  if (!IdExiste) {
    throw { status: 404, message: 'No se encontro el ID' };
  }
  await deleteInforme(id);
};

export const archivoInforme = async (id) => {
  return await informeArchivo(id);
};