/* RUTAS DE INFORMATIVA -- USUARIO */
import express from 'express';
import multer from 'multer'; // Middleware para manejar multipart/form-data
import { methods as UsuarioInfoControllers } from '../../controllers/Informativas/UsuarioInfoCon.js';
import { requireAdminSession, requireUserSession } from '../../middlewares/controllersmid.js';
const UsuarioInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas
const upload = multer(); // Almacena los archivos en memoria

UsuarioInfoRou.get('/users/usuario/:nickname', requireAdminSession, UsuarioInfoControllers.nickname); // Pedir el nickname del usuario -- /informe/users/usuario/:nickname
UsuarioInfoRou.get('/users/lista/nombres', requireAdminSession, UsuarioInfoControllers.getlistaUsuarios); // Pedir la lista de usuarios -- /informe/users/lista/nombres
UsuarioInfoRou.get('/users/datos/usuario', requireUserSession, UsuarioInfoControllers.getDatosSeleccionado); // Pedir los datos del personal seleccionado -- /informe/users/datos/usuario
UsuarioInfoRou.get('/users/foto/usuario', requireUserSession, UsuarioInfoControllers.getFotoSeleccionado); // Pedir la foto del personal seleccionado -- /informe/users/foto/usuario
UsuarioInfoRou.get('/users/datos/seleccion/:nickname', requireAdminSession, UsuarioInfoControllers.getDatosSeleccion); // Pedir los datos del personal seleccionado en seleccion -- /informe/users/datos/seleccion/:nickname
UsuarioInfoRou.get('/users/foto/seleccion/:nickname', requireAdminSession, UsuarioInfoControllers.getFotoSeleccion); // Pedir la foto del personal seleccionado en seleccion -- /informe/users/foto/seleccion/:nickname
UsuarioInfoRou.post('/users/datos/guardar/:editar', requireUserSession, UsuarioInfoControllers.updateDatos); // Editar los datos del personal -- /informe/users/datos/guardar/:editar
UsuarioInfoRou.post('/users/guardar/foto', requireUserSession, upload.single('foto'), UsuarioInfoControllers.updateDatos); // Editar la foto del personal -- /informe/users/guardar/foto

export default UsuarioInfoRou;