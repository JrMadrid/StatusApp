/* SERVICIOS DE INFORMATIVA -- MANTENIMIENTO */
import { fechaSeleccionada, fechasRealizadas, getMantenimientoArchivo, getMantenimientosArchivos } from "../../models/Informativas/ManteInfoMod.js";

// Mandar el documento del mantemiento seleccionado
export const fechaMantenimientoSeleccionado = async (id) => {
  return await fechaSeleccionada(id);
};

// Mandar las fechas vinculadas al economico
export const fechasMantenimientosRealizados = async (economico) => {
  return await fechasRealizadas(economico);
};

// Mandar el archivo de la constancia de la fecha seleccionada
export const obtenerArchivoMantenimiento = async (fechasr, economico) => {
  return await getMantenimientoArchivo(fechasr, economico);
};

// Mandar todas las constancias
export const obtenerArchivosMantenimientos = async (economico) => {
  const constanciasArchivos = await getMantenimientosArchivos(economico);

  if (constanciasArchivos.length > 0) {
    const archivos = constanciasArchivos.map(item => {
      return item.constancia;
    })
    return archivos;
  } else {
    throw { code: 404, message: 'Mantenimientos no encontrados' };
  }
};