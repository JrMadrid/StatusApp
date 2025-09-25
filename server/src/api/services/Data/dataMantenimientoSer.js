/* SERVICIOS DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import {
  obtenerMantenimientos, actualizarMantenimientoConConstancia,
  comprobarID, comprobarFechaRealizada, ConstanciaExiste, comprobarSuMantenimiento, ecoSucursal, nextFEstimada
} from '../../models/Data/dataMantenimientoMod.js';

// Pedir los datos de los mantenimientos de las sucursales
export const listarMantenimientos = async (responsable, tipo) => {
  return await obtenerMantenimientos(responsable, tipo);
}

// Agregar constancia de mantenimiento
export const publicarConstancia = async ({ frealizada, descripcion, id, imagen, responsable }) => {
  if (!(await comprobarID(id))) throw { code: 404, message: 'No se encontró el ID' };
  if (!(await comprobarSuMantenimiento(id, responsable))) throw { code: 400, message: 'No es su mantenimiento' };
  if (!(await comprobarFechaRealizada(frealizada, id))) throw { code: 400, message: 'Fecha realizada menor a fecha estimada' };
  if (await ConstanciaExiste(id)) throw { code: 409, message: 'Ya tiene constancia' };

  const suSucursal = await ecoSucursal(id);
  const [yy] = frealizada.split('-');
  const siguiFEstimada = await nextFEstimada(frealizada);

  await actualizarMantenimientoConConstancia({ frealizada, descripcion, imagen, id, yy, siguiFEstimada, suSucursal });
};