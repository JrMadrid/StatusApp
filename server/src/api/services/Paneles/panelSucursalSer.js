/* SERVICIOS PARA VALIDAR DATOS DE SUCURSALES */
import { EconomicoOcupado, comprobarID, Neconomico, IngResponsable, getSucursales, postSucursal, updateSucursal, deleteSucursal } from '../../models/Paneles/panelSucursalMod.js';

// Pedir los datos de las sucursales
export const obtenerSucursales = async () => {
  return await getSucursales();
};

// Agregar una nueva sucursal
export const agregarSucursal = async (economico, canal, nombre, ingresponsable, rellena) => {
  if (await EconomicoOcupado(economico)) { throw { code: 406, message: 'El Economico definido ya existe en la base de datos' }; }
  if (!(await IngResponsable(ingresponsable))) { throw { code: 404, message: 'No se encontro el ing. Responsable' }; }

  await postSucursal(economico, canal, nombre, ingresponsable, rellena);
};

// Actualizar una sucursal
export const actualizarSucursal = async (economico, canal, nombre, id, ingresponsable, rellenar) => {
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontro el ID' }; }

  if (await EconomicoOcupado(economico)) { throw { code: 406, message: 'El Economico definido ya existe en la base de datos' }; }

  if (ingresponsable.length !== 0) {
    if (!(await IngResponsable(ingresponsable))) { throw { code: 404, message: 'No se encontro el ing. Responsable' }; }
  }

  await updateSucursal(economico, canal, nombre, id, ingresponsable, rellenar);
};

// Eliminar una sucursal
export const eliminarSucursal = async (id) => {
  if (!(await comprobarID(id))) { throw { code: 404, message: 'No se encontró el ID' }; }

  await deleteSucursal(id);
};