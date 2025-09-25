/* ABRIR LA PUERTA*/
import ZK from 'node-zklib'; // Librería para la comunicación con el dispositivo biométrico
import config from "../../configs/BIOMETRICO_config.js";

const puerto = config.BIOMETRICOpuerto;

export const BIOMETRICOsolicitud = async (ip, comando) => {
  let device = new ZK(ip, puerto, 10000, 4000); // Crear una nueva instancia del dispositivo biométrico
  let response = false
  try {
    await device.createSocket(); // Crear un socket para la comunicación

    const buffer = await device.executeCmd(comando); // Ejecutar el comando

    const responseCode = buffer.readUInt16LE(0); // Leer el código de respuesta del buffer
    if (comando === 31) { // Comando para abrir la puerta
      if (responseCode === 2000) { // Verificar si el código de respuesta es 2000 (éxito)
        response = true;
      }
    }
    return { message: response, comando: `${comando}` }
  } catch (err) {
    console.error('Error:', err);
    return { message: response, comando: `${comando}` }
  } finally {
    if (device.connectionType !== null) { // Verificar si el dispositivo está conectado
      await device.disconnect(); // Desconectar el dispositivo
    }
  }
};