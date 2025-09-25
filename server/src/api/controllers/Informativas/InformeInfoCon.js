/* CONTROLADORES DE INFORMATIVA --  INFORMES */
import { obtenerInfoInforme, obtenerArchivoInforme } from '../../services/Informativas/InformeInfoSer.js';

// Pedir el id del informe
const verid = async (req, res) => {
  try {
    req.session.verinforme = req.params.id;
    req.session.save(err => {
      if (err) console.error('Error al guardar la sesión:', err);
    });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error: // Pedir el id del informe, ', error);
    res.sendStatus(500);
  }
};

// Mandar los datos del informe
const informeinfo = async (req, res) => {
  try {
    const datos = await obtenerInfoInforme(req.session.verinforme);
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error: // Mandar los datos del informe, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error con los datos' });
  }
};

// Mandar el informe
const informe = async (req, res) => {
  try {
    const documento = await obtenerArchivoInforme(req.session.verinforme);

    if (!documento.informe) {
      res.sendStatus(404);
    }

    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `inline; filename="informe.pdf"`);
    res.status(200).send(documento.informe);
  } catch (error) {
    console.error('Error: // Mandar el informe, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error con el informe' });
  }
};

export const methods = { verid, informeinfo, informe };