/* CONTROLADORES DE PANEL DE SUCURSALES */
import { obtenerSucursales, agregarSucursal, actualizarSucursal, eliminarSucursal } from '../../services/Paneles/panelSucursalSer.js';
import { SchemaCrearSucursal, SchemaActualizarSucursal, SchemaEliminarSucursal } from '../../validators/Paneles/panelSucursalVar.js';

// Pedir los datos de las sucursales
const getSucursales = async (req, res) => {
  try {
    const sucursales = await obtenerSucursales();
    res.status(200).json(sucursales);
  } catch (error) {
    console.error('Error: // Pedir los datos de las sucursales, ', error);
    res.status(error?.code || 500).json({ message: error?.message || "Error al obtener los datos de las sucursales" });
  }
};

// Agregar una nueva sucursal
const postSucursal = async (req, res) => {
  try {
    const { economico, canal, nombre, ingresponsable, rellenar } = req.body;
    const { error/* , value */ } = SchemaCrearSucursal.validate(req.body, { abortEarly: false });
    if (error) {
      const mensajes = error.details.map(err => err.message).join('\n');
      return res.status(400).json({ message: mensajes });
    }
    await agregarSucursal(economico, canal, nombre, ingresponsable, rellenar);
    res.status(200).json({ message: 'Sucursal agregada exitosamente' });
  } catch (error) {
    console.error('Error: // Agregar una nueva sucursal, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error agregando nuevos datos' });
  }
};

// Actualizar una sucursal
const updateSucursal = async (req, res) => {
  try {
    const { economico, canal, nombre, id, ingresponsable, rellenar } = req.body;
    const { error } = SchemaActualizarSucursal.validate(req.body, { abortEarly: false });
    if (error) {
      const mensajes = error.details.map(err => err.message).join('\n');
      return res.status(400).json({ message: mensajes });
    }
    await actualizarSucursal(economico, canal, nombre, id, ingresponsable, rellenar);
    res.status(200).json({ message: 'Sucursal actualizada exitosamente' });
  } catch (error) {
    console.error('Error: // Actualizar una sucursal, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error actualizando datos' });
  }
};

// Eliminar una sucursal
const deleteSucursal = async (req, res) => {
  try {
    const { id } = req.body;
    const { error } = SchemaEliminarSucursal.validate(req.body, { abortEarly: false });
    if (error) {
      const mensajes = error.details.map(err => err.message).join('\n');
      return res.status(400).json({ message: mensajes });
    }
    await eliminarSucursal(id);
    res.status(200).json({ message: 'Sucursal eliminada exitosamente' });
  } catch (error) {
    console.error('Error: // Eliminar una sucursal, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error eliminando datos' });
  }
};

export const methods = { getSucursales, postSucursal, updateSucursal, deleteSucursal };