/* CONTROLADORES DE LA INFORMACIÓN DE LOS MANTENIMIENTOS */
import { listarMantenimientos, publicarConstancia } from '../../services/Data/dataMantenimientoSer.js';
import { SchemaAgregarConstanciaMantenimiento } from '../../validators/Data/dataMantenimientoVal.js';

// Pedir los datos de los mantenimientos
const getMantenimientos = async (req, res) => {
  try {
    const responsable = req.session.user;
    const tipo = req.session.tipo
    const result = await listarMantenimientos(responsable, tipo);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error: // Pedir los datos de los mantenimientos, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error con los mantenimientos' });
  }
};

// Agregar constancia de mantenimiento
const postConstancia = async (req, res) => {
  try {
    const { frealizada, descripcion = '', id } = req.body;
    const imagen = req.file.buffer; // Obtiene el archivo como un buffer
    const responsable = req.session.user;

    const { error } = SchemaAgregarConstanciaMantenimiento.validate(req.body, { abortEarly: false });
    if (error) {
      const erroresUnidos = error.details.map(err => err.message).join('\n');
      res.status(400).json({ message: erroresUnidos })
    }

    await publicarConstancia({ frealizada, descripcion, id, imagen, responsable })
    res.status(200).json({ message: 'Mantenimiento agregado exitosamente' }); // Responder con éxito

  } catch (error) {
    console.error('Error: // Agregar constancia de mantenimiento, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error agregando nuevo mantenimiento' }); // Responder con falla
  }
};

export const methods = { getMantenimientos, postConstancia };