/* SERIVICOS PARA VALIDAR DATOS DE MANUALES */
import { comprobarID, getManuales, postManuales, deleteManual, updateManual, Manual } from "../../models/Paneles/panelManualMod.js";

// Pedir los datos de los manuales
export const obtenerManuales = async () => {
  return await getManuales();
};

// Agregar un nuevo manual
export const publicarManual = async (descripcion, nombre, documento, manual) => {
  return await postManuales(descripcion, nombre, documento, manual);
};

// Eliminar un manual
export const eliminarManual = async (id) => {
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontro el ID' }; }
  await deleteManual(id);
};

// Actualizar un manual
export const actualizarManual = async (nombre, descripcion, id) => {
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontro el ID' }; }
  await updateManual(nombre, descripcion, id);
};

// Pedir el manual en formato PDF
export const manualArchivo = async (id) => {
  return await Manual(id);
};