/* SERVICIOS DE INFORME -- SUCURSAL */
import { getDatosAplicaciones, dispositivoIP, infoGeneralDispositivo, dispositivosSucursal, actualizarGeneral, actualizarDescripcion } from "../../models/Informes/SucursalInfoMod.js";

export const obtenerDatosAplicaciones = async (economico) => {
  return await getDatosAplicaciones(economico);
};

export const nombreDispositivoXIP = async (ip) => {
  return await dispositivoIP(ip);
};

export const informationGneralDispositivo = async (ip) => {
  return await infoGeneralDispositivo(ip);
};

export const dispositiosValidos = async (economico) => {
  return await dispositivosSucursal(economico)
};

export const actualizarInformacionGeneral = async (general, ip) => {
  await actualizarGeneral(general, ip);
};

export const actualizarInformacionDescripcion = async (descripcion, ip) => {
  await actualizarDescripcion(descripcion, ip);
};