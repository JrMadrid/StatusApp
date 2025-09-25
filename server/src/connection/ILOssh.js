/* CONEXIÓN A LA ILO VIA SSH */
// Importo la librería node-ssh para realizar la conexión SSH
import { NodeSSH } from 'node-ssh';

// Importo la configuración (credenciales y comando) desde el archivo correspondiente
import config from "../configs/ILO_configs.js";

// Importo los servicios que procesan los datos obtenidos desde la ILO
import { ILOdata, ILOhardware, ILOdescripcion } from '../datos/ILOdata.js';

// Desestructuro las variables necesarias desde la configuración
const username = config.ILOusername;
const password = config.ILOpassword;
const command = config.ILOcommand;
const intentos = 1;

/**
 * Función para conectarse a la ILO por SSH, ejecutar comandos y obtener la información general
 * @param {string} host - Dirección IP o hostname de la ILO
 * @returns {object} - Información obtenida de la ILO o mensaje de error
 */
export const ILOssh = async (host) => {
  const ssh = new NodeSSH();

  try {
    // Pequeña función para generar retardos (delay) en milisegundos
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Función interna que maneja la conexión y ejecución de comandos con reintentos
    async function exec(comando) {
      for (let i = 0; i < intentos; i++) {
        try {
          await ssh.connect({
            host,
            username,
            password,
            readyTimeout: 1000
          });
          const result = await ssh.execCommand(comando);

          if (result.stdout) return result.stdout; //Si obtuvo información, la devuelve
          if (result.stderr) return null; // Si hay error en la salida, regreso null
        } catch (err) {
          // Ignoro el error y reintento
        }
        await delay(3000); // Espero 3 segundos antes de reintentar
      }
      return null;
    }

    // Intento ejecutar el comando principal
    let prueba = await exec(command);

    if (prueba) {
      // Si responde, ejecuto el comando 'show' para obtener información detallada
      const showCommand = 'show';
      const showData = await exec(showCommand);

      // Proceso los datos obtenidos
      const sshInfo = await ILOdata(showData);
      return sshInfo;
    } else {
      return { informacionimportante: 'Sin Información' };
    }

  } catch (error) {
    // En caso de fallo, devuelvo mensaje indicando error de conexión
    return { general: 'Se ha producido un error de conexión. Para acceder al portal de administración de la ILO, haz clic en el botón de acceso en la parte superior de la información' };
  } finally {
    ssh.dispose(); // Libero la conexión SSH
  }
};

/**
 * Función para obtener información específica del hardware desde la ILO vía SSH
 * @param {string} host - Dirección IP o hostname de la ILO
 * @returns {object} - Información del hardware o mensaje vacío si falla
 */
export const ILOHardware = async (host) => {
  const ssh = new NodeSSH();

  try {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function exec(comando) {
      await ssh.connect({
        host,
        username,
        password,
        readyTimeout: 60000
      });
      const result = await ssh.execCommand(comando);
      await delay(2000);
      return result.stdout;
    }

    const prueba = await exec(command);

    if (prueba) {
      const showCommand = 'show';
      const showData = await exec(showCommand);

      const HardwareInfo = await ILOhardware(showData);
      return HardwareInfo;
    } else {
      return { informaciongeneral: '' };
    }

  } catch (error) {
    return { informaciongeneral: '' };
  } finally {
    ssh.dispose();
  }
};

/**
 * Función para obtener la descripción general del hardware desde la ILO vía SSH
 * @param {string} host - Dirección IP o hostname de la ILO
 * @returns {object} - Descripción del hardware o mensaje vacío si falla
 */
export const ILODescripcion = async (host) => {
  const ssh = new NodeSSH();

  try {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function exec(comando) {
      await ssh.connect({
        host,
        username,
        password,
        readyTimeout: 60000
      });
      const result = await ssh.execCommand(comando);
      await delay(2000);
      return result.stdout;
    }

    const prueba = await exec(command);

    if (prueba) {
      const showCommand = 'show';
      const showData = await exec(showCommand);

      const descripcionInfo = await ILOdescripcion(showData);
      return descripcionInfo;
    } else {
      return { descripcion: '' };
    }

  } catch (error) {
    return { descripcion: '' };
  } finally {
    ssh.dispose();
  }
};