/* RUTAS DE INFORMATIVA -- USUARIO */
import express from 'express';
import { methods as UsuarioInfoControllers } from '../../controllers/Informativas/UsuarioInfoCon.js';
const UsuarioInfoRou = express.Router(); // Crea un nuevo objeto Router que se puede usar para definir rutas

UsuarioInfoRou.get('/users/usuario/:nickname', UsuarioInfoControllers.nickname); // Pide el nickname del usuario -- /informe/users/usuario/:nickname

export default UsuarioInfoRou;