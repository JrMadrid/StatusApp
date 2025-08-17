/* SERVICIOS DE INFORMATIVA -- USUARIO */
import { getListaUsuarios, getDatosSeleccionado, editDataPersonal, editFotoPersonal, getFotoSeleccionado, desactivarSuper } from "../../models/Informativas/UsuarioInfoMod.js";

// Pedir la lista de usuarios
export const obtenerListaUsuarios = async () => {
  return await getListaUsuarios();
};

// Pedir los datos del personal seleccionado
export const obtenerDatosSeleccionado = async (seleccionado) => {
  return await getDatosSeleccionado(seleccionado);
};

// Pedir la foto del personal seleccionado
export const obtenerFotoSeleccionado = async (seleccionado) => {
  return await getFotoSeleccionado(seleccionado);
};

// Editar los datos del personal
export const editarDatosPersonal = async (propiedadEditar, propiedadEditada, id) => {
  if (await desactivarSuper(id)) { throw { code: 403, message: 'No se puede desactivar al super administrador' }; }
  await editDataPersonal(propiedadEditar, propiedadEditada, id);
}

// Editar la foto del personal
export const editarFotoPersonal = async (foto, id) => {
  await editFotoPersonal(foto, id);
}