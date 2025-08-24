/* SERVICIOS PARA VALIDAR DATOS DE MANTENIMIENTOS */
import { getMantenimientos, comprobarFechaEstimada, comprobarID, SucursalExiste, postMantenimiento, updateMantenimiento, deleteMantenimiento } from "../../models/Paneles/panelMantenimientoMod.js";

// Pedir los datos de los mantenimientos
export const obtenerMantenimientos = async () => {
  return await getMantenimientos();
};

// Agregar un nuevo mantenimiento
export const publicarMantenimiento = async (festimada, economico) => {
  if (!(await comprobarFechaEstimada(festimada))) { throw { code: 400, message: 'Fecha estimada menor a 01/Enero/2024' }; }
  if (!(await SucursalExiste(economico))) { throw { code: 404, message: 'No se encontro la sucursal (economico no valido)' }; }
  return await postMantenimiento(festimada, economico);
};

// Actualizar un mantenimiento
export const actualizarMantenimiento = async (festimada, economico, id) => {
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontro el ID' }; }
  if (festimada.length !== 0) {
    if (!(await comprobarFechaEstimada(festimada))) { throw { code: 400, message: 'Fecha estimada menor a 01/Enero/2024' }; }
  }
  if (economico.length !== 0) {
    if (!(await SucursalExiste(economico))) { throw { code: 404, message: 'No se encontro la sucursal (economico no valido)' }; }
  }
  return await updateMantenimiento(festimada, economico, id);
};

// Eliminar un mantenimiento
export const eliminarMantenimiento = async (id) => {
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontro el ID' }; }
  return await deleteMantenimiento(id);
};