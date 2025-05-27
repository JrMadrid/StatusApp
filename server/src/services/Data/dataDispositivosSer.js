/* SERVICIOS DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import { obtenerDispositivos, obtenerListaDispositivos } from '../../models/Data/dataDispositivosMod.js';

export const listarDispositivos = async (responsable, tipo) => {
	return await obtenerDispositivos(responsable, tipo);
};

export const listarNombresDispositivos = async (responsable, tipo) => {
	return await obtenerListaDispositivos(responsable, tipo);
};