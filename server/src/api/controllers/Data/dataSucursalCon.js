/* CONTROLADORES DE LA INFORMACIÓN DE LAS SUCURSALES */
import { listarSucursales } from '../../services/Data/dataSucursalSer.js';

// Pedir los datos de las sucursales
const getSucursales = async (req, res) => {
  try {
    const responsable = req.session.user;
    const tipo = req.session.tipo;
    let result;
    result = await listarSucursales(responsable, tipo);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error: // Pedir los datos de las sucursales, ', error);
    res.status(error?.code || 500).json({ message: error?.message || "Error al obtener los datos de las sucursales" });
  }
};

export default getSucursales;