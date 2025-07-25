/* RUTAS DE INFORMATIVA -- USUARIO */
import express from 'express';
import { methods as UsuarioInfoControllers } from '../../controllers/Informativas/UsuarioInfoCon.js';
import { requireAdminSession } from '../../middlewares/controllersmid.js';
const UsuarioInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

UsuarioInfoRou.get('/users/usuario/:nickname', requireAdminSession, UsuarioInfoControllers.nickname); // Pide el nickname del usuario -- /informe/users/usuario/:nickname
UsuarioInfoRou.get('/users/lista/nombres', requireAdminSession, UsuarioInfoControllers.listaUsuarios); // Pide la lista de usuarios -- /informe/users/lista/nombres

export default UsuarioInfoRou;