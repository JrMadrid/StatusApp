/* SERVICIOS DE LA INFORMACIÓN DE LAS SUCURSALES */
import { obtenerSucursales } from '../../models/Data/dataSucursalMod.js';

// Pedir los datos de las sucursales
export const listarSucursales = async (responsable, tipo) => {
  return await obtenerSucursales(responsable, tipo);
}