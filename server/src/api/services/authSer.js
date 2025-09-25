/* SERVICIOS DE AUTENTICACIÓN DE USUARIOS*/
import { comprobarUsuario, usuarioExiste, comprobarActivo } from '../models/authMod.js';

// Leer y comprobar el usuario
export async function loginService(nickname, psw) {
  if (!(await usuarioExiste(nickname))) { throw { code: 404, message: "El usuario no existe" } };
  if (!(await comprobarActivo(nickname))) { throw { code: 403, message: "Su acceso es inválido" } };

  return await comprobarUsuario(nickname, psw);
};

// Definir el tipo de usuario
export function definirTipoUsuario(session) {
  const user = {
    username: session.user,
    isAdmin: session.admin,
    tipo: session.tipo,
    id: 0
  };
  if (session.admin == undefined) return user;

  if (session.admin === true) {
    user.id = (session.tipo === 'Super Administrador') ? 1 : 2;
  } else {
    user.id = (session.tipo === 'Aplicativo') ? 3 : 4;
  }

  return user;
};