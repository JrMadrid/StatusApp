/* MANEJO DE ERRORES GLOBALES */
import { server } from '../index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Convierte la URL del archivo actual a una ruta de archivo local
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual
const logPath = path.join(__dirname, '../logs/error.log'); // Ruta del archivo de log de errores
const logsDir = path.resolve('src/logs'); // Ruta del directorio de logs
const logFile = path.join(logsDir, 'error.log'); // Ruta del archivo de log de errores

const logDir = path.join(process.cwd(), 'src', 'logs'); // Crear directorio log
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
};

function logToFile(message) { // Archivo de log
  const timestamp = new Date().toISOString(); // Obtener la fecha y hora actual en formato ISO
  const logEntry = `[${timestamp}] ${message}\n\n`; 
  fs.appendFileSync(logFile, logEntry, 'utf8'); // Escribir el mensaje en el archivo de log
};

function logErrorToFile(message, error) { // Archivo de log de errores
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n${error?.stack || error}\n\n`;
  fs.appendFileSync(logPath, logEntry, 'utf8');
};

function shutdownProcess() { // Apagar el servidor
  if (server && server.close) { // Verifica si el servidor está definido y tiene el método close
    server.close(() => {
      console.log('Servidor cerrado. Saliendo del proceso...');
      process.exit(1); // Salir del proceso con un código de error 1
    });
  } else {
    process.exit(1); // Si el servidor no está definido, salir del proceso con un código de error 1
  }
};

export function handleUncaughtExceptions() { // Manejo de excepciones no controladas
  process.on('uncaughtException', (error) => {
    const message = 'Excepción no controlada';
    console.error(`${message}: `, error);
    logErrorToFile(message, error);
    shutdownProcess(); // Apagar el servidor
  });
};

export function handleUnhandledRejections() { // Manejo de promesas no manejadas
  process.on('unhandledRejection', (reason, promise) => {
    let errorMessage = 'Rechazo no manejado en la promesa:\n';

    if (reason instanceof Error) {
      errorMessage += `${reason.stack}`;
    } else {
      errorMessage += `${JSON.stringify(reason)}`;
    }

    console.error(errorMessage);
    logToFile(errorMessage);
    shutdownProcess();
  });
};