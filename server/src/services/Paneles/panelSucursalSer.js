/* SERVICIOS PARA VALIDAR DATOS DE SUCURSALES */
import { EconomicoOcupado, comprobarID, Neconomico, IngResponsable, getSucursales, postSucursal, updateSucursal, deleteSucursal } from '../../models/Paneles/panelSucursalMod.js';

// Pedimos los datos de las sucursales
export const obtenerSucursales = async () => {
  return await getSucursales();
};

// Agregamos una nueva sucursal
export const agregarSucursal = async (economico, canal, nombre, ingresponsable, rellena) => {
  const EsEconomicoOcupado = await EconomicoOcupado(economico);
  if (EsEconomicoOcupado) {
    throw { status: 406, message: 'El Economico definido ya existe en la base de datos' };
  }
  const IngExiste = await IngResponsable(ingresponsable);
  if (!IngExiste) {
    throw { status: 404, message: 'No se encontro el ing. Responsable' };
  }
  await postSucursal(economico, canal, nombre, ingresponsable, rellena);
};

// Actualizamos una sucursal
export const actualizarSucursal = async (economico, canal, nombre, id, ingresponsable, rellenar) => {
  const IdExiste = await comprobarID(id);
  if (!IdExiste) {
    throw { status: 404, message: 'No se encontro el ID' };
  }

  const EsEconomicoOcupado = await EconomicoOcupado(economico)
  if (EsEconomicoOcupado) {
    throw { status: 406, message: 'El Economico definido ya existe en la base de datos' };
  }

  if (ingresponsable.length !== 0) {
    const IngExiste = await IngResponsable(ingresponsable);
    if (!IngExiste) {
      throw { status: 404, message: 'No se encontro el ing. Responsable' };
    }
  }

  await updateSucursal(economico, canal, nombre, id, ingresponsable, rellenar);
};

// Eliminamos una sucursal
export const eliminarSucursal = async (id) => {
  const IdExiste = await comprobarID(id);
  if (!IdExiste) {
    throw { status: 404, message: 'No se encontró el ID' };
  }
  await deleteSucursal(id);
};