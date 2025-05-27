/* DEFINE LA ESTRUCTURA Y LA LÓGICA PRINCIPAL DE LA APLICACIÓN */
import express from 'express'; // Importa el módulo 'express' que permite crear aplicaciones web y APIs en Node.js.
import { handleUncaughtExceptions, handleUnhandledRejections } from './utils/errorHandlers.js';
import { appMiddlewares } from './middlewares/appMid.js';
import { Routes } from './routes/Routes.js';
const app = express(); // Crea una instancia de la aplicación Express para manejar las solicitudes HTTP y definir las rutas de la aplicación.

/* Manejo de errores globales */
handleUncaughtExceptions();
handleUnhandledRejections();

/* Middlewares */
appMiddlewares(app);

/* Rutas */
Routes(app);

export default app;