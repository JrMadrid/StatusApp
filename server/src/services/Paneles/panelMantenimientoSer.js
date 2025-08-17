/* SERVICIOS PARA VALIDAR DATOS DE MANTENIMIENTOS */
import { getMantenimientos, comprobarFechaEstimada, comprobarID, SucursalExiste, postMantenimientos, deleteMantenimiento } from "../../models/Paneles/panelMantenimientoMod.js";

// Pedir los datos de los mantenimientos
export const obtenerMantenimientos = async () => {
  return await getMantenimientos();
};

// Agregar un nuevo mantenimiento
export const publicarMantenimientos = async (festimada, economico) => {
  if (!(await comprobarFechaEstimada(festimada))) { throw { code: 400, message: 'Fecha estimada menor a 01/Enero/2024' }; }
  if (!(await SucursalExiste(economico))) { throw { code: 404, message: 'No se encontro la sucursal (economico no valido)' }; }
  return await postMantenimientos(festimada, economico);
};

// Eliminar un mantenimiento
export const eliminarMantenimiento = async (id) => {
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontro el ID' }; }
  return await deleteMantenimiento(id);
};