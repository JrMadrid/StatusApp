/* CONTROLADORES DE INFORMATIVA -- MANTENIMIENTO */
import { fechaMantenimientoSeleccionado, fechasMantenimientosRealizados, obtenerArchivoMantenimiento, obtenerArchivosMantenimientos } from '../../services/Informativas/ManteInfoSer.js';

// Pedir el número economico 
const economico = async (req, res) => {
  try {
    const numero = req.params.economico;
    const id = req.params.id;
    req.session.numeroMante = numero;
    req.session.numeroManteid = id;
    req.session.save(err => {
      if (err) {
        console.error('Error al guardar el numero economico:', err);
      }
    });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error: // Pedir el número economico, ', error);
    res.sendStatus(500)
  }
};

// Mandar el documento del mantemiento seleccionado
const mantenimientoSeleccionado = async (req, res) => {
  try {
    const id = req.session.numeroManteid;
    if (id === '0') throw { code: 404, message: 'Mantenimiento no valido' };

    const mantenimiento = await fechaMantenimientoSeleccionado(id);
    if (!mantenimiento.constancia) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'image/jpeg'); // Cambia el tipo de contenido a JPEG
    res.set('Content-Disposition', `inline; filename="constancia.jpg"`); // Cambia el nombre del archivo a descargar
    res.status(200).send(mantenimiento.constancia);

  } catch (error) {
    console.error('Error: // Mandar el documento del mantemiento seleccionado, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Constancia no encontrado' });
  }
};

// Mandar las fechas vinculadas al economico
const fechasr = async (req, res) => {
  try {
    const economico = req.session.numeroMante;
    const fechasr = await fechasMantenimientosRealizados(economico)
    return res.status(200).json(fechasr);
  } catch (error) {
    console.error('Error: // Manda las fechas vinculadas al economico, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Fechas no encontradas' });
  }
};

// Mandar el archivo de la constancia de la fecha seleccionada
const info = async (req, res) => {
  try {
    const fechasr = req.params.fechasr;

    if (fechasr && fechasr !== null && fechasr !== 'null') {
      const economico = req.session.numeroMante;
      const constanciaArchivo = await obtenerArchivoMantenimiento(fechasr, economico);
      if (!constanciaArchivo.constancia) {
        return res.sendStatus(404);
      }
      res.set('Content-Type', 'image/jpeg'); // Cambia el tipo de contenido a JPEG
      res.set('Content-Disposition', `inline; filename="constancia.jpg"`); // Cambia el nombre del archivo a descargar
      res.status(200).send(constanciaArchivo.constancia);
    } else {
      return res.status(400).json({ message: 'Fecha no valida' });
    }
  } catch (error) {
    console.error('Error: // Manda el archivo de la constancia de la fecha seleccionada, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Mantenimiento no encontrado' }); // Responder con falla
  }
};

// Mandar todas las constancias
const infos = async (req, res) => {
  try {
    const economico = req.session.numeroMante;
    const constancias = await obtenerArchivosMantenimientos(economico);
    res.status(200).json(constancias);
  } catch (error) {
    console.error('Error: // Mandar todas las constancias, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error interno' });
  }
};

export default { economico, mantenimientoSeleccionado, fechasr, info, infos };