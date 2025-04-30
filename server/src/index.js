/* INICIAR EL SERVIDOR */
import { connectToDatabase, syncStore } from './db/session.js';
import app from "./app.js"; 
import config from "./configs/APP_config.js"; // Importo la configuración con las credenciales y el puerto de la aplicación desde el archivo de configuración
import debug from 'debug'; // Importamos la librería debug para el manejo de logs

const debugServer = debug('app:server'); // Creamos un objeto de depuración para el servidor
const host = config.APPhost || 'localhost'; // Definimos el host del servidor, si no está definido en la configuración, usamos 'localhost' por defecto
const port = config.APPport || 88; // Definimos el puerto del servidor, si no está definido en la configuración, usamos el puerto 88 por defecto

// Configuramos el entorno de desarrollo para mostrar los logs de depuración definiendo los prefixos de los logs que queremos ver
if (process.env.NODE_ENV === 'development') {
  debug.enable('app:*'); // Habilitamos los logs de depuración para el entorno de desarrollo
} else {
  debug.disable(); // Deshabilitamos los logs de depuración para otros entornos
}

/* INICIAR EL SERVIDOR */
const startServer = async () => { // Iniciamos el servidor
  try {
    await connectToDatabase(); // Conectamos a la base de datos
    await syncStore(); // Sincronizamos la tienda de sesiones
    app.listen(port, () => { // Iniciamos el servidor en el puerto definido
      console.log(`Servidor backend escuchando en ${host}:${port}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1); // Salimos del proceso con un código de error 1
  }
};

startServer(); // Llamamos a la función para iniciar el servidor