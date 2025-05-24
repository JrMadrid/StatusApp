/* DEFINE LA ESTRUCTURA Y LA LÓGICA PRINCIPAL DE LA APLICACIÓN */
import express from 'express'; // Importa el módulo 'express' que permite crear aplicaciones web y APIs en Node.js.
import cors from 'cors'; // Importa el módulo 'cors' para habilitar la política de intercambio de recursos de origen cruzado (CORS) y permitir solicitudes desde diferentes dominios.
import session from 'express-session'; // Importa el módulo 'express-session' para manejar sesiones en la aplicación web, permitiendo la gestión de datos del usuario a lo largo de las solicitudes.
import morgan from 'morgan'; // Modulo morgan nos permite visualizar las solicitudes en la consola
import path from 'path'; // Importa el módulo 'path', que proporciona utilidades para trabajar con rutas de archivos y directorios
import { fileURLToPath } from 'url'; // Importa la función 'fileURLToPath' desde el módulo 'url', que convierte una URL de archivo a una ruta de archivo local
import { store } from './db/session.js'; // Importa el store
import { requireUserSession, requireAdminSession } from './middlewares/controllersmid.js';
const app = express();

const __filename = fileURLToPath(import.meta.url); // Convierte la URL del archivo actual a una ruta de archivo local
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

/* Importar Routers */
import authRou from './routes/authRou.js'; // Rutas de autenticación de usuarios
import dataSucursalRou from './routes/Data/dataSucursalRou.js'; // Rutas para ver los datos de las sucursales
import dataDispositivosRou from './routes/Data/dataDispositivosRou.js'; // Rutas para ver los datos de las dispositivos
import dataMantenimientoRou from './routes/Data/dataMantenimientoRou.js'; // Rutas para ver los datos de los mantenimientos
import panelUserRou from './routes/Paneles/panelUsersRou.js'; // Rutas para administrar usuarios
import panelSucursalRou from './routes/Paneles/panelSucursalRou.js' // Rutas para administrar sucursales
import panelDispositivosRou from './routes/Paneles/panelDispositivosRou.js'; // Rutas para administrar dispositivos
import panelMantenimientoRou from './routes/Paneles/panelMatenimientoRou.js'; // Rutas para administrar mantenimientos
import panelManualesRou from './routes/Paneles/panelManualesRou.js' // Rutas para administrar manuales
import panelInformeRou from './routes/Paneles/panelInformeRou.js'; // Rutas para administrar informes
import SucursalInfoRou from './routes/Informes/SucursalInfoRou.js'; // Rutas de informe -- Sucursal
import DispositivosInfoRou from './routes/Informes/DispositivosInfoRou.js'; // Rutas de informe -- Dispositivos
import ManteInfoRou from './routes/Informes/ManteInfoRou.js'; // Rutas de informe -- Mantenimiento
import ManualInfoRou from './routes/Informes/ManualInfoRou.js'; // Rutas de informe -- Manual
import InformeInfoRou from './routes/Informes/InformeInfoRou.js'; // Rutas de informe -- Informes

/* Manejo de errores globales */
process.on('uncaughtException', (error) => { // Manejo de excepciones no controladas
	console.error('Excepción no controlada:', error);
	// Lógica para manejar la excepción, como enviar un correo electrónico o registrar el error en un archivo o cerrar la aplicación
});

process.on('unhandledRejection', (reason, promise) => { // Manejo de promesas no manejadas
	console.error('Rechazo no manejado en la promesa:', reason);
	// Lógica para manejar el rechazo
});

/* Middlewares */
app.use(cors({
	// origin: '', // Permite solicitudes desde cualquier origen
	origin: 'http://localhost:3000', // Permite solicitudes desde cualquier origen ---devs
	credentials: true, // Permite el envío de cookies y encabezados de autorización
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
	allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos en las solicitudes
}));

// Configuración basica de CORS
//app.use(morgan('dev')); // Middleware para registrar las solicitudes HTTP en la consola para modo de desarrollo
//app.use(morgan('combined')); // Middleware para registrar las solicitudes HTTP en un formato combinado para modo de producción

app.use(express.json()); // Middleware para analizar el cuerpo de las solicitudes JSON

// Session
app.use(session({
	secret: 'mysecretkey_pps', // Clave secreta utilizada para firmar la ID de la sesión. Es fundamental que esta clave sea única y difícil de adivinar para asegurar la integridad y autenticidad de la sesión del usuario.
	resave: false, // Configura si la sesión debe ser guardada de nuevo en el almacenamiento en cada solicitud, incluso si no ha sido modificada. Al establecerlo en false, la sesión no se guardará innecesariamente, lo cual puede mejorar el rendimiento y reducir el uso de almacenamiento.
	saveUninitialized: false, // Configura si las sesiones nuevas (que aún no han sido modificadas) deben ser guardadas en el almacenamiento. Al establecerlo en true, se asegura que una sesión se guarde en el almacenamiento incluso si no ha sido modificada, lo que puede ser útil para que se genere una sesión para nuevos usuarios, pero puede aumentar el uso de almacenamiento.
	cookie: {
		secure: false, // Indica si la cookie debe ser transmitida solo a través de conexiones HTTPS. Al establecerlo en false, la cookie se puede transmitir a través de conexiones HTTP, lo que puede ser útil para entornos de desarrollo, pero no es seguro para producción.
		maxAge: 24 * 60 * 60 * 1000, // Establece la duración máxima de la cookie en milisegundos. En este caso, se establece en 24 horas (24 horas * 60 minutos * 60 segundos * 1000 milisegundos).
		httpOnly: true, // Indica si la cookie debe ser accesible solo a través de HTTP(S) y no a través de JavaScript en el lado del cliente. Al establecerlo en true, se protege la cookie de ataques XSS (Cross-Site Scripting), ya que no puede ser accedida por scripts del lado del cliente.
		sameSite: 'lax', // Configura la política SameSite de la cookie. Al establecerlo en 'strict', la cookie solo se enviará en solicitudes de origen cruzado si el sitio de origen es el mismo que el del servidor, lo que ayuda a prevenir ataques CSRF (Cross-Site Request Forgery). ---devs
		// sameSite: 'strict', // Configura la política SameSite de la cookie. Al establecerlo en 'strict', la cookie solo se enviará en solicitudes de origen cruzado si el sitio de origen es el mismo que el del servidor, lo que ayuda a prevenir ataques CSRF (Cross-Site Request Forgery). 
		// domain: '192.168.100.8', // Dominio para el cual la cookie es válida. Esto puede ser útil para restringir el acceso a la cookie a un dominio específico. ---devs va comentado
		path: '/' // Ruta para la cual la cookie es válida. Al establecerlo en '/', la cookie será válida para todas las rutas del dominio especificado.
	},
	store: store, // Almacén de sesiones personalizado. En este caso, se utiliza un almacén de sesiones que permite guardar las sesiones en una base de datos o en otro tipo de almacenamiento persistente, lo que es útil para mantener las sesiones entre reinicios del servidor.
}))

app.use(express.static(path.join(__dirname, '../public'))); // Middleware para servir archivos estáticos desde el directorio 'public'

/* Rutas */
app.use('/auth', requireUserSession, authRou); // Rutas de autenticación de usuarios
app.use('/api', requireUserSession, dataSucursalRou); // Rutas para ver los datos de las sucursales
app.use('/api', requireUserSession, dataDispositivosRou); // Rutas para ver los datos de las dispositivos
app.use('/api', requireUserSession, dataMantenimientoRou); // Rutas para ver los datos de los mantenimientos
app.use('/panel', requireAdminSession, panelUserRou); // Rutas para administrar usuarios
app.use('/panel', requireAdminSession, panelSucursalRou);  // Rutas para administrar sucursales
app.use('/panel', requireAdminSession, panelDispositivosRou); // Rutas para administrar dispositivos
app.use('/panel', requireAdminSession, panelMantenimientoRou); // Rutas para administrar mantenimientos
app.use('/panel', requireAdminSession, panelManualesRou); // Rutas para administrar manuales
app.use('/panel', requireAdminSession, panelInformeRou); // Rutas para administrar informes
app.use('/informe', requireUserSession, SucursalInfoRou); // Rutas de informe -- Sucursal
app.use('/informe', requireUserSession, DispositivosInfoRou); // Rutas de informe -- Dispositivos
app.use('/informe', requireUserSession, ManteInfoRou); // Rutas de informe -- Mantenimiento
app.use('/informe', requireUserSession, ManualInfoRou); // Rutas de informe -- Manual
app.use('/informe', requireUserSession, InformeInfoRou); // Rutas de informe -- Informes
// Ruta para manejar todas las peticiones que no coinciden con las rutas definidas anteriormente y servir el index.html
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public', 'index.html')); // Envía el archivo 'index.html' como respuesta a cualquier ruta no definida
});

export default app;