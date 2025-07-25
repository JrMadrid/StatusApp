/* SERVICIOS DE INFORMATIVA -- USUARIO */
import { getListaUsuarios } from "../../models/Informativas/UsuarioInfoMod.js";

export const obtenerListaUsuarios = async () => {
  return await getListaUsuarios();
};