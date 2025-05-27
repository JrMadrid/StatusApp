/* SERIVICOS PARA VALIDAR DATOS DE MANUALES */
import { comprobarID, getManuales, postManuales, deleteManual, updateManual, Manual } from "../../models/Paneles/panelManualMod.js";

// Pedimos los datos de los manuales
export const obtenerManuales = async () => {
  return await getManuales();
};

// Agregamos un nuevo manual
export const publicarManual = async (descripcion, nombre, documento, manual) => {
  return await postManuales(descripcion, nombre, documento, manual);
};

// Eliminamos un manual
export const eliminarManual = async (id) => {
  try {
    const IdExiste = await comprobarID(id);
    if (!IdExiste) {
      throw { status: 404, message: 'No se encontro el ID' };
    }
    await deleteManual(id);
  } catch (error) {
    throw { status: 500, message: 'Error eliminando datos' };
  }
};

// Actualizamos un manual
export const actualizarManual = async (nombre, descripcion, id) => {
  const IdExiste = await comprobarID(id);
  if (!IdExiste) {
    throw { status: 404, message: 'No se encontro el ID' };
  }
  await updateManual(nombre, descripcion, id);
};

// Pedimos el manual en formato PDF
export const manualArchivo = async (id) => {
  return await Manual(id);
};