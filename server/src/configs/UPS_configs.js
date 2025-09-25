/* CONFIGURACIÓN A LA UPS */
// Importo el módulo 'dotenv' para poder leer las variables de entorno definidas en el archivo .env
import { config } from "dotenv"; // Permite ejecutar la función config y cargar las variables de entorno en process.env

// Ejecuto la configuración para tener disponibles las variables de entorno en process.env
config();

// Exporto un objeto por defecto que contiene las credenciales y el comando para la conexión a la UPS
// Si alguna variable no está definida en el .env, se asigna un string vacío
export default {
  UPSusername: process.env.UPS_USERNAME || "",   // Usuario para acceder a la UPS
  UPSpassword: process.env.UPS_PASSWORD || "",   // Contraseña del usuario de la UPS
  UPScommand: process.env.UPS_COMMAND || ""      // Comando que se va a ejecutar en la UPS
};