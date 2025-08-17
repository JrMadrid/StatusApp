/* SERVICIOS DE INFORMATIVA -- SUCURSAL */
import { getDatosDispositivos, dispositivoIP, infoGeneralDispositivo, dispositivosSucursal, actualizarGeneral, actualizarDescripcion } from "../../models/Informativas/SucursalInfoMod.js";

// Consultar y retornar los dispositivos registrados por número económico
export const DatosDispositivos = async (economico) => {
  return await getDatosDispositivos(economico);
};

// Obtener la información general de un dispositivo en específico por su IP
export const nombreDispositivoXIP = async (ip) => {
  return await dispositivoIP(ip);
};

// Consultar información general y de la sucursal del dispositivo
export const informationGneralDispositivo = async (ip) => {
  return await infoGeneralDispositivo(ip);
};

// Consultar todos los dispositivos válidos de la sucursal
export const dispositiosValidos = async (economico) => {
  return await dispositivosSucursal(economico)
};

// Actualizar el campo "general" en la base de datos
export const actualizarInformacionGeneral = async (general, ip) => {
  await actualizarGeneral(general, ip);
};

// Actualizar el campo "descripcion" en la base de datos
export const actualizarInformacionDescripcion = async (descripcion, ip) => {
  await actualizarDescripcion(descripcion, ip);
};