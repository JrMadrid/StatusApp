/* INICIAR EL SERVIDOR */
import { connectToDatabase, syncStore } from './db/session.js';
import dbConnection from './db/connection.js';
import app from "./app.js";
import config from "./configs/APP_config.js"; // Importo la configuración con las credenciales y el puerto de la aplicación desde el archivo de configuración
import debug from 'debug'; // Importamos la librería debug para el manejo de logs

let server;
const debugServer = debug('app:server'); // Creamos un objeto de depuración para el servidor
const host = config.APPhost; // Definimos el host del servidor, si no está definido en la configuración, usamos 'localhost' por defecto
const port = config.APPport; // Definimos el puerto del servidor, si no está definido en la configuración, usamos el puerto 88 por defecto

// Configuramos el entorno de desarrollo para mostrar los logs de depuración definiendo los prefixos de los logs que queremos ver
if (process.env.NODE_ENV === 'development') {
  debug.enable('app:*'); // Habilitamos los logs de depuración para el entorno de desarrollo
} else {
  debug.disable(); // Deshabilitamos los logs de depuración para otros entornos
};

// Función con reintentos
const intentos = async (fn, retries, delay = 3000, name = 'operación') => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      console.error(`Error en ${name}, intento ${attempt} de ${retries}:`, err.message);
      if (attempt >= retries) throw err;
      console.log(`Reintentando en ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

/* INICIAR EL SERVIDOR */
const startServer = async () => { // Iniciamos el servidor
  try {
    await intentos(dbConnection, 3, 3000, 'Conexión a la BD principal'); // Conectamos a la base de datos principal
    await intentos(connectToDatabase, 3, 3000, 'Conexión a la BD de sesiones'); // Conectamos a la base de datos de sesiones
    await intentos(syncStore, 3, 3000, 'Sincronización de sesiones'); // Sincronizamos la tienda de sesiones
    server = app.listen(port, () => { // Iniciamos el servidor en el puerto definido
      console.log(`Servidor backend escuchando en ${host}:${port}`);
    });


  } catch (err) {
    console.error('Error al iniciar el servidor: ', err);
    process.exit(1); // Salimos del proceso con un código de error 1
  }
};

startServer(); // Llamamos a la función para iniciar el servidor

/* Simular errores */
// throw new Error('Error de prueba: excepción no controlada'); // Simular una excepción no controlada
// Promise.reject('Error de prueba: promesa rechazada sin catch'); // Simular un rechazo no manejado

export { server }; // Exportar el servidor para cerrarlo en errores globales