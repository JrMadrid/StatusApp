/* CONFIGURACIÓN AL BIOMETRICO */
// Importo el módulo 'dotenv' para poder leer las variables de entorno definidas en el archivo .env
import { config } from "dotenv" // Permite ejecutar la función config y cargar las variables de entorno en process.env

// Ejecuto la configuración para que las variables de entorno estén disponibles
config();

// Exporto un objeto por defecto que contiene las credenciales y el puerto del biométrico
// Estos valores se obtienen desde el archivo .env o se dejan en vacío si no están definidos
export default {
    BIOMETRICOusername: process.env.BIOMETRICO_USERNAME || "",  // Usuario del biométrico
    BIOMETRICOpassword: process.env.BIOMETRICO_PASSWORD || "",  // Contraseña del biométrico
    BIOMETRICOpuerto: process.env.BIOMETRICO_PUERTO || "",      // Puerto donde se conecta el biométrico
};