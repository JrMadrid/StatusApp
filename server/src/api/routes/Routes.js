/* RUTAS DE LA APLICACIÓN */
import path from 'path'; // Importa el módulo 'path', que proporciona utilidades para trabajar con rutas de archivos y directorios
import { fileURLToPath } from 'url'; // Importa la función 'fileURLToPath' desde el módulo 'url', que convierte una URL de archivo a una ruta de archivo local
import { requireUserSession } from '../../middlewares/controllersmid.js';

const __filename = fileURLToPath(import.meta.url); // Convierte la URL del archivo actual a una ruta de archivo local
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

import authRou from './authRou.js'; // Rutas de autenticación de usuarios
/* Data */
import dataSucursalRou from './Data/dataSucursalRou.js'; // Rutas para ver los datos de las sucursales
import dataDispositivosRou from './Data/dataDispositivosRou.js'; // Rutas para ver los datos de las dispositivos
import dataMantenimientoRou from './Data/dataMantenimientoRou.js'; // Rutas para ver los datos de los mantenimientos
/* Paneles de administracion */
import panelUserRou from './Paneles/panelUsersRou.js'; // Rutas para administrar usuarios
import panelSucursalRou from './Paneles/panelSucursalRou.js' // Rutas para administrar sucursales
import panelDispositivosRou from './Paneles/panelDispositivosRou.js'; // Rutas para administrar dispositivos
import panelMantenimientoRou from './Paneles/panelMatenimientoRou.js'; // Rutas para administrar mantenimientos
import panelManualesRou from './Paneles/panelManualesRou.js' // Rutas para administrar manuales
import panelInformeRou from './Paneles/panelInformeRou.js'; // Rutas para administrar informes
/* Paginas Informativas */
import UsuarioInfoRou from './Informativas/UsuarioInfoRou.js'; // Rutas de informativa -- Usuario
import SucursalInfoRou from './Informativas/SucursalInfoRou.js'; // Rutas de informativa -- Sucursal
import DispositivosInfoRou from './Informativas/DispositivosInfoRou.js'; // Rutas de informativa -- Dispositivos
import ManteInfoRou from './Informativas/ManteInfoRou.js'; // Rutas de informativa -- Mantenimiento
import ManualInfoRou from './Informativas/ManualInfoRou.js'; // Rutas de informativa -- Manual
import InformeInfoRou from './Informativas/InformeInfoRou.js'; // Rutas de informativa -- Informes

export const Routes = (app) => {
  app.use('/auth', authRou); // Rutas de autenticación de usuarios
  app.use('/api', requireUserSession, dataSucursalRou); // Rutas para ver los datos de las sucursales
  app.use('/api', requireUserSession, dataDispositivosRou); // Rutas para ver los datos de las dispositivos
  app.use('/api', requireUserSession, dataMantenimientoRou); // Rutas para ver los datos de los mantenimientos
  app.use('/panel', panelUserRou); // Rutas para administrar usuarios
  app.use('/panel', panelSucursalRou);  // Rutas para administrar sucursales
  app.use('/panel', panelDispositivosRou); // Rutas para administrar dispositivos
  app.use('/panel', panelMantenimientoRou); // Rutas para administrar mantenimientos
  app.use('/panel', panelManualesRou); // Rutas para administrar manuales
  app.use('/panel', panelInformeRou); // Rutas para administrar informes
  app.use('/informe', requireUserSession, UsuarioInfoRou); // Rutas de informativa -- Usuario
  app.use('/informe', requireUserSession, SucursalInfoRou); // Rutas de informativa -- Sucursal
  app.use('/informe', requireUserSession, DispositivosInfoRou); // Rutas de informativa -- Dispositivos
  app.use('/informe', requireUserSession, ManteInfoRou); // Rutas de informativa -- Mantenimiento
  app.use('/informe', requireUserSession, ManualInfoRou); // Rutas de informativa -- Manual
  app.use('/informe', requireUserSession, InformeInfoRou); // Rutas de informativa -- Informes
  // Ruta para manejar todas las peticiones que no coinciden con las rutas definidas anteriormente y servir el index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public', 'index.html')); // Envía el archivo 'index.html' como respuesta a cualquier ruta no definida
  });
};