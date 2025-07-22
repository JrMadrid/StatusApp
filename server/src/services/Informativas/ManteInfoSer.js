/* SERVICIOS DE INFORMATIVA -- MANTENIMIENTO */
import { fechasRealizadas, getMantenimientoArchivo, getMantenimientosArchivos } from "../../models/Informativas/ManteInfoMod.js";

export const fechasMantenimientosRealizados = async (economico) => {
  return await fechasRealizadas(economico);
};

export const obtenerArchivoMantenimiento = async (fechasr, economico) => {
  const constanciasArchivo = await getMantenimientoArchivo(fechasr, economico);

  if (constanciasArchivo.length > 0) {
    const archivo = constanciasArchivo[0].constancia;

    return archivo;
  } else {
    throw { status: 404, message: 'Archivo no encontrado' };
  }
};

export const obtenerArchivosMantenimientos = async (economico) => {
  const constanciasArchivos = await getMantenimientosArchivos(economico);

  if (constanciasArchivos.length > 0) {
    const archivos = constanciasArchivos.map(item => {
      return item.constancia;
    })
    return archivos;
    
  } else {
    throw { status: 404, message: 'Archivos no encontrados' };
  }
};