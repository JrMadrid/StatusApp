/* CONTROLADRES DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import { DatosDispositivos, listaDispositivos } from '../../services/Data/dataDispositivosSer.js';

// Pedir los datos de los dispositivos
const getDatosDispositivos = async (req, res) => {
  try {
    const responsable = req.session.user;
    const tipo = req.session.tipo;
    const dispositivos = await DatosDispositivos(responsable, tipo);
    res.status(200).json(dispositivos);
  } catch (error) {
    console.error('Error: // Pedir los datos de los dispositivos, ', error);
    res.status(error?.code || 500).json({ message: error?.message || "Error pidiendo los datos de los dispositivos" });
  }
};

// Pedir la lista de los dispositivos
const getListaDispositivos = async (req, res) => {
  try {
    const responsable = req.session.user;
    const tipo = req.session.tipo;
    const lista = await listaDispositivos(responsable, tipo);
    res.status(200).json(lista);
  } catch (error) {
    console.error('Error: // Pedir la lista de los dispositivos, ', error);
    res.status(error?.code || 500).json({ message: error?.message || "Error pidiendo la lista de los dispositivos" });
  }
};

export const methods = { getDatosDispositivos, getListaDispositivos };