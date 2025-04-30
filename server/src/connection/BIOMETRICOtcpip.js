/* CONEXIÓN AL BIOMETRICO VIA TCP */
import ZK from 'node-zklib'; // Importo la librería node-zklib para comunicarme con el dispositivo biométrico
import config from "../configs/BIOMETRICO_config.js"; // Importo la configuración con las credenciales y el puerto del biométrico desde el archivo de configuración
import { BiometricoData, Biometricohardware } from '../datos/BIOMETRICOdata.js'; // Importo las funciones que procesarán la información obtenida del biométrico

// Desestructuro las variables necesarias desde la configuración
const username = config.BIOMETRICOusername;
const password = config.BIOMETRICOpassword;
const puerto = config.BIOMETRICOpuerto;

/**
 * Función para conectarse al biométrico vía TCP/IP, obtener información del dispositivo y procesarla
 * @param {string} ip - Dirección IP del biométrico
 * @returns {object} - Respuesta procesada o mensaje de error
 */
export const BIOMETRICOtcpip = async (ip) => {
    // Creo una instancia de ZK con la IP y el puerto configurado
    let device = new ZK(ip, puerto, 10000, 4000); // Timeout de conexión y de lectura
    
    try {
        // Intento establecer la conexión TCP con el biométrico
        try {
            await device.createSocket();
        } catch (error) {
            // Si falla la conexión, retorno mensaje indicando que no hay conexión
            return { informacionimportante: 'Sin conexión TCP' };
        }

        // Obtengo información general del dispositivo
        const deviceinfo = await device.getInfo();

        // Proceso la información recibida con la función BiometricoData
        const respuesta = await BiometricoData(deviceinfo);

        return respuesta;

    } catch (err) {
        console.error('Error:', err);
        return { informacionimportante: 'Sin conexión TCP' };
    } finally {
        // Cierro la conexión si está activa
        if (device.connectionType !== null) {
            await device.disconnect();
        }
    }
};

/**
 * Función para obtener información más específica del hardware del biométrico
 * @param {string} ip - Dirección IP del biométrico
 * @returns {object} - Respuesta procesada con la información del hardware
 */
export const BiometricoHardware = async (ip) => {
    let device = new ZK(ip, puerto, 10000, 4000);
    try {
        // Establezco la conexión
        await device.createSocket();

        // Envío un comando hexadecimal (0x044C) específico al dispositivo para obtener datos del hardware
        const buffer = await device.executeCmd(0x044C); 
        
        // Leo el código de respuesta desde el buffer recibido
        const responseCode = buffer.readUInt16LE(0); 

        // Proceso el buffer y el código de respuesta
        const respuesta = await Biometricohardware(responseCode, buffer);

        return respuesta;

    } catch (err) {
        console.error('Error:', err);
        return { informaciongeneral: '' };
    } finally {
        // Cierro la conexión si está activa
        if (device.connectionType !== null) {
            await device.disconnect();
        }
    }
};