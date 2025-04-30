/* CONEXIÓN A LA BASE DE DATOS */
import config from "../configs/DB_config.js"; //Configuración de las variables de entorno
import sql from 'mssql';
import debug from 'debug'; // Importar el módulo de depuración

const debugDb = debug('app:db');

// Configuración de la conexión a la base de datos 
const dbConfig = {
    server: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: 1433,
    options: {
        encrypt: true, // Si estas utilizando encriptación 
        trustServerCertificate: true // Para desarrollo local
    }
};
async function dbConnection() {
    debugDb('Conectando a la base de datos...');
    await sql.connect(dbConfig); // Conectarse a la base de datos
    debugDb('Conectado a la base de datos');
}

export default dbConnection;