/* SERVICIO DE LA INFORMACIÓN DE LAS SUCURSALES */
import { obtenerSucursales } from '../../models/Data/dataSucursalMod.js';

export const listarSucursales = async (responsable, tipo) => {
  return await obtenerSucursales(responsable, tipo);
}