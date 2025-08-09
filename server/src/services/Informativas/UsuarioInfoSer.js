/* SERVICIOS DE INFORMATIVA -- USUARIO */
import { getListaUsuarios, getDatosSeleccionado, editDataPersonal, editFotoPersonal, getFotoSeleccionado } from "../../models/Informativas/UsuarioInfoMod.js";

// Pide la lista de usuarios
export const obtenerListaUsuarios = async () => {
  return await getListaUsuarios();
};

// Pide los datos del personal seleccionado
export const obtenerDatosSeleccionado = async (seleccionado) => {
  return await getDatosSeleccionado(seleccionado);
};

// Pide la foto del personal seleccionado
export const obtenerFotoSeleccionado = async (seleccionado) => {
  return await getFotoSeleccionado(seleccionado);
};

// Edita los datos del personal
export const editarDatosPersonal = async (propiedadEditar, propiedadEditada, id) => {
  await editDataPersonal(propiedadEditar, propiedadEditada, id);
}

// Edita la foto del personal
export const editarFotoPersonal = async (foto, id) => {
  await editFotoPersonal(foto, id);
}