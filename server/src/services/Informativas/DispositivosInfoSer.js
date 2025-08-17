/* SERVICIOS DE INFORMATIVA -- DISPOSITIVOS */
import { obtenerDispositivosNombre, obtenerInfoDispositivos } from '../../models/Informativas/DispositivosInfoMod.js';

// Mandar los dispositivos con ese nombre
export const dispositivosNombre = async (dispositivo, responsable, tipo) => {
	return await obtenerDispositivosNombre(dispositivo, responsable, tipo);
};

// Pedir los datos de los dispositivos
export const infoDispositivo = async (dispositivo, responsable, tipo) => {
	return await obtenerInfoDispositivos(dispositivo, responsable, tipo);
};