/* CONEXIÓN A LA UPS VIA SSH */
// Importo la librería 'NodeSSH' para la conexión SSH a la UPS
import { NodeSSH } from 'node-ssh';
import config from "../configs/UPS_configs.js"; // Configuraciones de la UPS
import { UPSdata } from '../datos/UPSdata.js'; // Función para manejar los datos de la UPS
import { UPShardware } from '../datos/UPSdata.js'; // Función para manejar los datos de hardware de la UPS
import { UPSdescripcion } from '../datos/UPSdata.js'; // Función para manejar la descripción de la UPS

const username = config.UPSusername;  // Nombre de usuario para la conexión SSH
const password = config.UPSpassword;  // Contraseña para la conexión SSH
const command = config.UPScommand;    // Comando para inicializar la conexión
const intentos = 3;                   // Número de intentos en caso de fallo

/**
 * Establece una conexión SSH con la UPS y obtiene información relevante.
 * @param {string} host - Dirección IP o hostname del host de la UPS.
 * @returns {Promise<object>} - Datos de la UPS obtenidos por SSH o mensaje de error.
 */
export const UPSssh = async (host) => {
  const ssh = new NodeSSH();

  try {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Ejecuta un comando SSH en el host y obtiene la respuesta.
     * @param {string} comando - Comando a ejecutar en la UPS.
     * @returns {Promise<string|null>} - Resultado del comando o null en caso de error.
     */
    async function exec(comando) {
      for (let i = 0; i < intentos; i++) {
        try {
          await ssh.connect({
            host, username, password, readyTimeout: 60000
          });
          const result = await ssh.execCommand(comando);
          if (result.stdout) {
            return result.stdout;
          }
          if (result.stderr) {
            console.error(`Error con ${comando}: `, result.stderr);
            return null;
          }
        } catch (err) {
          console.error('Error durante la conexión o ejecución del comando:', err);
        }
        await delay(3000); // Espera 3 segundos antes de reintentar
      }
      return null;
    }

    // Ejecuta el comando inicial
    let prueba = await exec(command);

    if (prueba) {
      // Si la conexión es exitosa, obtenemos diversos datos de la UPS
      const statusCommand = 'detstatus -all';
      const statusData = await exec(statusCommand);
      const statusTransfeCommand = 'xferStatus';
      const statusTransfeData = await exec(statusTransfeCommand);
      const lastTransfeCommand = 'lastrst';
      const lastTransfeData = await exec(lastTransfeCommand);
      const alarmCountCommand = 'alarmcount';
      const alarmCountData = await exec(alarmCountCommand);
      const dateCommand = 'date';
      const dateData = await exec(dateCommand);

      // Se procesan los datos y se devuelven
      const sshInfo = await UPSdata(statusData, statusTransfeData, lastTransfeData, alarmCountData, dateData);
      return sshInfo;
    } else {
      return { informacionrelevante: 'Sin Información' };
    }

  } catch (error) {
    console.error('Error de conexión:', error);
    return { informacionrelevante: '"Se ha producido un error de conexión. Para acceder al portal de administración de la UPS, haz clic en el boton de acceso en la parte superior de la información"' };
  } finally {
    ssh.dispose(); // Finaliza la conexión SSH
  }
};

/**
 * Obtiene información sobre el hardware de la UPS a través de SSH.
 * @param {string} host - Dirección IP o hostname del host de la UPS.
 * @returns {Promise<object>} - Datos del hardware de la UPS.
 */
export const UPSHardware = async (host) => {
  const ssh = new NodeSSH();

  try {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Ejecuta un comando SSH en el host y obtiene la respuesta.
     * @param {string} comando - Comando a ejecutar en la UPS.
     * @returns {Promise<string|null>} - Resultado del comando o null en caso de error.
     */
    async function exec(comando) {
      await ssh.connect({
        host, username, password, readyTimeout: 60000
      });
      const result = await ssh.execCommand(comando);
      if (result.stderr) {
        console.error(`Error con ${comando}: `, result.stderr);
      }
      await delay(2000);
      return result.stdout;
    }

    const prueba = await exec(command);

    if (prueba) {
      // Obtiene información detallada sobre el hardware de la UPS
      const aboutCommand = 'about';
      const aboutData = await exec(aboutCommand);
      const upsaboutCommand = 'upsabout';
      const upsaboutData = await exec(upsaboutCommand);

      // Procesa y devuelve la información del hardware
      const HardwareInfo = await UPShardware(aboutData, upsaboutData);
      return HardwareInfo;
    } else {
      return { informaciongeneral: '' };
    }

  } catch (error) {
    console.error('Error de conexión:', error);
    return { informaciongeneral: '' };
  } finally {
    ssh.dispose(); // Finaliza la conexión SSH
  }
};

/**
 * Obtiene una descripción detallada de la UPS a través de SSH.
 * @param {string} host - Dirección IP o hostname del host de la UPS.
 * @returns {Promise<object>} - Descripción detallada de la UPS.
 */
export const UPSDescripcion = async (host) => {
  const ssh = new NodeSSH();

  try {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Ejecuta un comando SSH en el host y obtiene la respuesta.
     * @param {string} comando - Comando a ejecutar en la UPS.
     * @returns {Promise<string|null>} - Resultado del comando o null en caso de error.
     */
    async function exec(comando) {
      await ssh.connect({
        host, username, password, readyTimeout: 60000
      });
      const result = await ssh.execCommand(comando);
      if (result.stderr) {
        console.error(`Error con ${comando}: `, result.stderr);
      }
      await delay(2000);
      return result.stdout;
    }

    const prueba = await exec(command);

    if (prueba) {
      // Obtiene información de la descripción de la UPS
      const upsaboutCommand = 'upsabout';
      const upsaboutData = await exec(upsaboutCommand);

      // Procesa y devuelve la descripción
      const descripcionInfo = await UPSdescripcion(upsaboutData);
      return descripcionInfo;
    } else {
      return { descripcion: '' };
    }

  } catch (error) {
    console.error('Error de conexión:', error);
    return { descripcion: '' };
  } finally {
    ssh.dispose(); // Finaliza la conexión SSH
  }
};