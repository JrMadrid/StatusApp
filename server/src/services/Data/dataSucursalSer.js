/* SERVICIO DE LA INFORMACIÓN DE LAS SUCURSALES */
import sql from 'mssql';
import { obtenerSucursales } from '../../models/Data/dataSucursalMod.js';

export const listarSucursales = async (responsable, tipo) => {
  const result = await obtenerSucursales(responsable, tipo);
  return result.recordset;
}