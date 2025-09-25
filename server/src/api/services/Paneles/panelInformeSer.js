/* SERVICIOS PARA VALIDAR DATOS DE INFORMES */
import { getInformes, SucursalExiste, SucursalPerteneciente, postInforme, deleteInforme, comprobarID, informeArchivo } from "../../models/Paneles/panelInformeMod.js";

// Pedir los datos de los informes
export const obtenerInformes = async (tipo, responsable) => {
  return await getInformes(tipo, responsable);
};

// Agregar un nuevo informe
export const publicarInforme = async (descripcion, nombre, documento, frealizada, economico, informe, ingeniero) => {
  if (!(await SucursalExiste(economico))) { throw { code: 404, message: 'No se encontro la sucursal (economico no valido)' }; }
  if (!(await SucursalPerteneciente(economico, ingeniero))) { throw { code: 404, message: 'No es su sucursal (economico no valido)' }; }
  await postInforme(descripcion, nombre, documento, frealizada, economico, informe);
};

// Eliminar un informe
export const eliminarInforme = async (id) => {
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontro el ID' }; }
  await deleteInforme(id);
};

// Pedir el informe en formato PDF
export const archivoInforme = async (id) => {
  return await informeArchivo(id);
};