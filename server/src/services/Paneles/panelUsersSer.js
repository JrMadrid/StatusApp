/* SERVICIOS PARA VALIDAR DATOS DE USUARIOS */
import bcrypt from 'bcryptjs'; // bcrypt para encriptar la contraseña
import { IDdelAdmin, NicknameOcupado, comprobarID, nombreResponsable, getUsers, postUser, updateUser, deleteUser, logoutaAllUsers } from '../../models/Paneles/panelUsersMod.js';

export const obtenerUsers = async () => {
  return await getUsers();
};

// Agregamos un nuevo usuario
export const agregarUser = async (nickname, psw, tipo) => {
  psw = psw.trim(); // Eliminar espacios en blanco al inicio y al final
  psw = await bcrypt.hash(psw, 12); // Encriptar la contraseña, el hash funciona como un algoritmo de encriptación que genera un hash de la contraseña, el 12 indica la complejidad del algoritmo

  let isAdmin = 0;
  if (tipo === 'Administrador') {
    isAdmin = 1;
  };

  const EsNicknameOcupado = await NicknameOcupado(nickname);
  if (EsNicknameOcupado) {
    throw { status: 409, message: 'El Nickname definido ya existe en la base de datos.' };
  };

  await postUser(nickname, psw, tipo, isAdmin);
};

// Actualizamos un usuario
export const actualizarUser = async (nickname, psw, id, tipo) => {
  if (psw.length !== 0) {
    psw = await bcrypt.hash(psw, 12); // Encriptar la contraseña 
  }

  const IdExiste = await comprobarID(id);
  if (!IdExiste) {
    throw { status: 404, message: 'No se encontró el ID' };
  }

  const EsNicknameOcupado = await NicknameOcupado(nickname);
  if (EsNicknameOcupado) {
    throw { status: 409, message: 'El Nickname definido ya existe en la base de datos.' };
  };

  await updateUser(nickname, psw, id, tipo);
};

// Eliminamos un usuario
export const eliminarUser = async (id, Super) => {

  const IdExiste = await comprobarID(id);
  if (!IdExiste) {
    throw { status: 404, message: 'No se encontro el ID' };
  }

  const Admin = await IDdelAdmin(id);
  if (Admin) {
    throw { status: 403, message: 'No se puede eliminar al super administrador' };
  }
  const ingResponsable = await nombreResponsable(id);

  await deleteUser(id, ingResponsable, Super);
}

// Cerramos la sesión de todos los usuarios
export const sacarAllUsers = async () => {
  await logoutaAllUsers();
};