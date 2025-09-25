/* CONFIGURACIÓN DE LA APLICACIÓN */
// Importo el módulo 'dotenv' para poder leer las variables de entorno definidas en el archivo .env
import { config } from "dotenv"; // Permite ejecutar la función config y cargar las variables de entorno en process.env

// Ejecuto la configuración para que las variables de entorno estén disponibles
config();

// Exporto un objeto por defecto que contiene las credenciales y el puerto del biométrico
// Estos valores se obtienen desde el archivo .env o se dejan en vacío si no están definidos
export default {
  APPhost: process.env.APP_HOST || "localhost", // Host donde en el que se ejecuta la aplicación
  APPport: process.env.APP_PORT || 88, // Puerto donde en el que se ejecuta la aplicación
  DEV: process.env.DEV == "true", // Modo de desarrollo
  MOCKS: process.env.MOCKS == "true" // Modo MOCK -- Datos de dispositivos para formato
};