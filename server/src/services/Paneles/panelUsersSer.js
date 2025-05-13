/* SERVICIOS PARA VALIDAR DATOS DE USUARIOS */
import { IDdelAdmin, NicknameOcupado, comprobarID, nombreResponsable, getUsers, postUser, updateUser, deleteUser, logoutaAllUsers } from '../../models/Paneles/panelUsersMod.js';

export const obtenerUsers = async () => {
  return await getUsers();
};

// Agregamos un nuevo usuario
export const agregarUser = async (nickname, psw, tipo) => {
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
  const IdExiste = await comprobarID(id);
  if (!IdExiste) {
    throw { status: 404, message: 'No se encontró el ID' };
  }

  await updateUser(nickname, psw, id, tipo);
};

// Eliminamos un usuario
export const eliminarUser = async (id) => {

  const IdExiste = await comprobarID(id);
  if (!IdExiste) {
    throw { status: 404, message: 'No se encontro el ID' };
  }

  const Admin = await IDdelAdmin(id);
  if (Admin) {
    throw { status: 403, message: 'No se puede eliminar al super administrador' };
  }
  const ingResponsable = await nombreResponsable(id);

  await deleteUser(id, ingResponsable);
}

// Cerramos la sesión de todos los usuarios
export const sacarAllUsers = async () => {
  await logoutaAllUsers();
};