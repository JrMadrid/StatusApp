/* CONEXIÓN A LA BASE DE DATOS */
import config from "../configs/DB_config.js";
import sql from 'mssql';
import debug from 'debug';

const debugDb = debug('app:db');

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

// Mantén una referencia al pool
let pool = null;

async function dbConnection() {
  if (pool) {
    debugDb('Reutilizando conexión existente.');
    return pool;
  }

  try {
    debugDb('Conectando a la base de datos...');
    pool = await sql.connect(dbConfig);
    debugDb('Conectado a la base de datos');
    return pool;
  } catch (err) {
    debugDb('Error al conectar a la base de datos:', err);
    throw err;
  }
}

// Opción para cerrar el pool manualmente si lo necesitas
// async function closeConnection() {
// 	if (pool) {
// 		await pool.close();
// 		debugDb('Conexión cerrada.');
// 		pool = null;
// 	}
// }

export default dbConnection;
// export { dbConnection, closeConnection };