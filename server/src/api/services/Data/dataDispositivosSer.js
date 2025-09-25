/* SERVICIOS DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import { obtenerDispositivos, obtenerListaDispositivos } from '../../models/Data/dataDispositivosMod.js';

// Pedir los datos de los dispositivos
export const DatosDispositivos = async (responsable, tipo) => {
  return await obtenerDispositivos(responsable, tipo);
};

// Pedir la lista de los dispositivos
export const listaDispositivos = async (responsable, tipo) => {
  return await obtenerListaDispositivos(responsable, tipo);
};