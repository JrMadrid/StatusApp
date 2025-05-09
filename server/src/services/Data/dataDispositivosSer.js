/* SERVICIOS DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
// import dbConnection from '../../db/connection.js';
import { obtenerDispositivos, obtenerListaDispositivos } from '../../models/Data/dataDispositivosMod.js';

export const listarDispositivos = async (responsable, tipo) => {
	// await dbConnection(); solo se inicia la conexion al arrancar el servidor;
	const result = await obtenerDispositivos(responsable, tipo);
	return result.recordset;
};

export const listarNombresDispositivos = async (responsable, tipo) => {
	// await dbConnection(); solo se inicia la conexion al arrancar el servidor;
	const result = await obtenerListaDispositivos(responsable, tipo);
	return result.recordset;
};