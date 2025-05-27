/* SERVICIOS DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import {
  obtenerMantenimientos, actualizarMantenimientoConConstancia,
  comprobarID, comprobarFechaRealizada, ConstanciaExiste, comprobarSuMantenimiento, ecoSucursal, nextFEstimada
} from '../../models/Data/dataMantenimientoMod.js';

export const listarMantenimientos = async (responsable, tipo) => {
  return await obtenerMantenimientos(responsable, tipo);
}

export const publicarConstancia = async ({ frealizada, descripcion, id, imagen, responsable }) => {
  const IdExiste = await comprobarID(id);
  if (!IdExiste) throw { status: 404, message: 'No se encontró el ID' };

  const esPropietario = await comprobarSuMantenimiento(id, responsable);
  if (!esPropietario) throw { status: 400, message: 'No es su mantenimiento' };

  const fechaValida = await comprobarFechaRealizada(frealizada, id);
  if (!fechaValida) throw { status: 400, message: 'Fecha realizada menor a fecha estimada' };

  const yaExiste = await ConstanciaExiste(id);
  if (yaExiste) throw { status: 409, message: 'Ya tiene constancia' };

  const suSucursal = await ecoSucursal(id);
  const [yy] = frealizada.split('-');
  const siguiFEstimada = await nextFEstimada(frealizada);

  try {
    await actualizarMantenimientoConConstancia({ frealizada, descripcion, imagen, id, yy, siguiFEstimada, suSucursal });
  } catch (error) {
    throw { status: 500, message: 'Error en la operación' };
  }
};