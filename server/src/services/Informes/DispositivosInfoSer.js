/* SERVICIOS DE INFORME -- DISPOSITIVOS */
import dbConnection from '../../db/connection.js';
import { fetchDispositivosByNombre, fetchInfoDispositivo } from '../../models/Informes/DispositivosInfoMod.js';

// Servicio para obtener dispositivos por nombre
export const getDispositivosPorNombre = async (dispositivo, responsable, tipo) => {
    await dbConnection();
    return await fetchDispositivosByNombre(dispositivo, responsable, tipo);
};

// Servicio para obtener info detallada de dispositivos
export const getInfoDispositivo = async (dispositivo, responsable, tipo) => {
    await dbConnection();
    return await fetchInfoDispositivo(dispositivo, responsable, tipo);
};