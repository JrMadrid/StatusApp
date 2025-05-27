/* SERVICIOS PARA VALIDAR DATOS DE MANTENIMIENTOS */
import { getMantenimientos, comprobarFechaEstimada, comprobarID, SucursalExiste, postMantenimientos, deleteMantenimiento } from "../../models/Paneles/panelMantenimientoMod.js";

export const obtenerMantenimientos = async () => {
  return await getMantenimientos();
};

export const publicarMantenimientos = async (festimada, economico) => {
  const festimadamayor = await comprobarFechaEstimada(festimada);
  if (!festimadamayor) {
    throw { status: 400, message: 'Fecha estimada menor a 01/Enero/2024' };
  }
  const isEconomicoValid = await SucursalExiste(economico)
  if (!isEconomicoValid) {
    throw { status: 404, message: 'No se encontro la sucursal (economico no valido)' };
  }
  return await postMantenimientos(festimada, economico);
};

export const eliminarMantenimiento = async (id) => {
  const IdExiste = await comprobarID(id);
  if (!IdExiste) {
    throw { status: 404, message: 'No se encontro el ID' };
  }
  return await deleteMantenimiento(id);
};