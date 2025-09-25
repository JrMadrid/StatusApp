/* CONTROLADORES DE INFORMATIVA -- MANUAL */
import { obtenerDatosManual, obtenerArchivoManual } from '../../services/Informativas/ManualInfoSer.js';

// Pedir el id del manual
const verid = async (req, res) => {
  try {
    const vermanualid = req.params.id;
    req.session.vermanual = vermanualid;
    req.session.save(err => {
      if (err) {
        console.error('Error al guardar la sesión:', err);
      }
    });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error: // Pedir el id del manual, ', error);
    res.sendStatus(500);
  }
}

// Mandar los datos del manual
const manualinfo = async (req, res) => {
  try {
    const manualid = req.session.vermanual;
    const manualinfo = await obtenerDatosManual(manualid);
    return res.status(200).json(manualinfo);

  } catch (error) {
    console.error('Error: // Mandar los datos del manual, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error con los datos del manual' });
  }
};

// Mandar el manual
const manual = async (req, res) => {
  try {
    const manualid = req.session.vermanual;
    let manualAr = await obtenerArchivoManual(manualid);
    if (!manualAr.manual) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'application/pdf'); // Cambia el tipo de contenido a PDF
    res.set('Content-Disposition', `inline; filename="manual.pdf"`); // Cambia el nombre del archivo a descargar
    res.status(200).send(manualAr.manual);

  } catch (error) {
    console.error('Error: // Mandar el manual, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error interno' }); // Responder con falla
  }
};

export const methods = { verid, manualinfo, manual };