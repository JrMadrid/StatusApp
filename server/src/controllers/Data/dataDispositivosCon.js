/* CONTROLADRES DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import { listarDispositivos, listarNombresDispositivos } from '../../services/Data/dataDispositivosSer.js';

// Pedimos los datos de los dispositivos
const getDispositivos = async (req, res) => {
        try {
            const responsable = req.session.user;
            const tipo = req.session.tipo;
            const dispositivos = await listarDispositivos(responsable, tipo);
            res.json(dispositivos);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
};

// Pedimnos la lista de los dispositivos
const getListaDispositivos = async (req, res) => {
        try {
            const responsable = req.session.user;
            const tipo = req.session.tipo;
            const lista = await listarNombresDispositivos(responsable, tipo);
            res.status(200).json(lista);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
};

export const methods = {
    getDispositivos,
    getListaDispositivos
};