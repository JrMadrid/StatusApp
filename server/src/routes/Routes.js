/* RUTAS DE LA APLICACIÓN */
import path from 'path'; // Importa el módulo 'path', que proporciona utilidades para trabajar con rutas de archivos y directorios
import { fileURLToPath } from 'url'; // Importa la función 'fileURLToPath' desde el módulo 'url', que convierte una URL de archivo a una ruta de archivo local
import { requireUserSession, requireAdminSession } from '../middlewares/controllersmid.js';

const __filename = fileURLToPath(import.meta.url); // Convierte la URL del archivo actual a una ruta de archivo local
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

import authRou from './authRou.js'; // Rutas de autenticación de usuarios
import dataSucursalRou from './Data/dataSucursalRou.js'; // Rutas para ver los datos de las sucursales
import dataDispositivosRou from './Data/dataDispositivosRou.js'; // Rutas para ver los datos de las dispositivos
import dataMantenimientoRou from './Data/dataMantenimientoRou.js'; // Rutas para ver los datos de los mantenimientos
import panelUserRou from './Paneles/panelUsersRou.js'; // Rutas para administrar usuarios
import panelSucursalRou from './Paneles/panelSucursalRou.js' // Rutas para administrar sucursales
import panelDispositivosRou from './Paneles/panelDispositivosRou.js'; // Rutas para administrar dispositivos
import panelMantenimientoRou from './Paneles/panelMatenimientoRou.js'; // Rutas para administrar mantenimientos
import panelManualesRou from './Paneles/panelManualesRou.js' // Rutas para administrar manuales
import panelInformeRou from './Paneles/panelInformeRou.js'; // Rutas para administrar informes
import SucursalInfoRou from './Informes/SucursalInfoRou.js'; // Rutas de informe -- Sucursal
import DispositivosInfoRou from './Informes/DispositivosInfoRou.js'; // Rutas de informe -- Dispositivos
import ManteInfoRou from './Informes/ManteInfoRou.js'; // Rutas de informe -- Mantenimiento
import ManualInfoRou from './Informes/ManualInfoRou.js'; // Rutas de informe -- Manual
import InformeInfoRou from './Informes/InformeInfoRou.js'; // Rutas de informe -- Informes

export const Routes = (app) => {
  app.use('/auth', authRou); // Rutas de autenticación de usuarios
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
}