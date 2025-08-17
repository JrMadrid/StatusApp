/* SERVICIOS PARA VALIDAR DATOS DE USUARIOS */
import bcrypt from 'bcryptjs'; // bcrypt para encriptar la contraseña
import { IDdelAdmin, NicknameOcupado, comprobarID, nombreResponsable, getUsers, postUser, updateUser, deleteUser, logoutaAllUsers } from '../../models/Paneles/panelUsersMod.js';

// Pedir los datos de los usuarios
export const obtenerUsers = async () => {
  return await getUsers();
};

// Agregar un nuevo usuario
export const agregarUser = async (nickname, psw, tipo) => {
  psw = psw.trim(); // Eliminar espacios en blanco al inicio y al final
  psw = await bcrypt.hash(psw, 12); // Encriptar la contraseña, el hash funciona como un algoritmo de encriptación que genera un hash de la contraseña, el 12 indica la complejidad del algoritmo

  let isAdmin = 0;
  if (tipo === 'Administrador') {
    isAdmin = 1;
  };
  if (await NicknameOcupado(nickname)) { throw { code: 409, message: 'El Nickname definido ya existe en la base de datos.' }; };

  await postUser(nickname, psw, tipo, isAdmin);
};

// Actualizar un usuario
export const actualizarUser = async (nickname, psw, id, tipo) => {
  if (psw.length !== 0) {
    psw = await bcrypt.hash(psw, 12); // Encriptar la contraseña 
  }
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontró el ID' }; }
  if (await NicknameOcupado(nickname)) { throw { code: 409, message: 'El Nickname definido ya existe en la base de datos.' }; };

  await updateUser(nickname, psw, id, tipo);
};

// Eliminar un usuario
export const eliminarUser = async (id, Super) => {
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontro el ID' }; }
  if (await IDdelAdmin(id)) { throw { code: 403, message: 'No se puede eliminar al super administrador' }; }

  const ingResponsable = await nombreResponsable(id);

  await deleteUser(id, ingResponsable, Super);
};

// Cerrar la sesión de todos los usuarios
export const sacarAllUsers = async () => {
  await logoutaAllUsers();
};