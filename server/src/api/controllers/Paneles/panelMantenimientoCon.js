/* CONTROLADORES DE PANEL DE MANTENIMIENTOS */
import { obtenerMantenimientos, publicarMantenimiento, actualizarMantenimiento, eliminarMantenimiento } from '../../services/Paneles/panelMantenimientoSer.js';
import { SchemaAgregarMantenimiento, SchemaActualizarMantenimiento, SchemaEliminarMantenimiento } from '../../validators/Paneles/panelMantenimientoVal.js';

// Pedir los datos de los mantenimientos
const getMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await obtenerMantenimientos();
    res.status(200).json(mantenimientos);
  } catch (error) {
    console.error('Error: // Pedir los datos de los mantenimientos, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error con los mantenimientos' });
  }
};

// Agregar un nuevo mantenimiento
const postMantenimiento = async (req, res) => {
  try {
    const { festimada, economico } = req.body;

    const { error } = SchemaAgregarMantenimiento.validate(req.body, { abortEarly: false });
    if (error) {
      const erroresUnidos = error.details.map(err => err.message).join('\n');
      return res.status(400).json({ message: erroresUnidos });
    }
    await publicarMantenimiento(festimada, economico);
    res.status(200).json({ message: 'Mantenimiento agregado exitosamente' });
  } catch (error) {
    console.error('Error: // Agregar un nuevo mantenimiento, ', error);
    res.status(500 || error?.code).json({ message: error?.message || 'Error agregando nuevo mantenimiento' });
  }
};

// Actualizar un mantenimiento
const updateMantenimiento = async (req, res) => {
  try {
    const { festimada, economico, id } = req.body;
    const { error } = SchemaActualizarMantenimiento.validate(req.body, { abortEarly: false });
    if (error) {
      const erroresUnidos = error.details.map(err => err.message).join('\n');
      return res.status(400).json({ message: erroresUnidos });
    }
    await actualizarMantenimiento(festimada, economico, id);
    res.status(200).json({ message: 'Mantenimiento actualizado exitosamente' });
  } catch (error) {
    console.error('Error: // Actualizar un mantenimiento, ', error);
    res.status(500 || error?.code).json({ message: error?.message || 'Error actualizando nuevo mantenimiento' });
  }
};

// Eliminar un mantenimiento
const deleteMantenimiento = async (req, res) => {
  try {
    const { id } = req.body;

    const { error } = SchemaEliminarMantenimiento.validate(req.body, { abortEarly: false });
    if (error) {
      const erroresUnidos = error.details.map(err => err.message).join('\n');
      return res.status(400).json({ message: erroresUnidos });
    }

    await eliminarMantenimiento(id);
    res.status(200).json({ message: 'Mantenimiento eliminado exitosamente' });
  } catch (error) {
    console.error('Error // Eliminar un mantenimiento, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error eliminando datos' });
  }
};

export const methods = { getMantenimientos, postMantenimiento, deleteMantenimiento, updateMantenimiento };