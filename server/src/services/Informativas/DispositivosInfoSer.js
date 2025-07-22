/* SERVICIOS DE INFORMATIVA -- DISPOSITIVOS */
import { fetchDispositivosByNombre, fetchInfoDispositivo } from '../../models/Informativas/DispositivosInfoMod.js';

// Servicio para obtener dispositivos por nombre
export const getDispositivosPorNombre = async (dispositivo, responsable, tipo) => {
	return await fetchDispositivosByNombre(dispositivo, responsable, tipo);
};

// Servicio para obtener info detallada de dispositivos
export const getInfoDispositivo = async (dispositivo, responsable, tipo) => {
	return await fetchInfoDispositivo(dispositivo, responsable, tipo);
};