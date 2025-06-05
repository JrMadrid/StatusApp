/* CONTROLADORES DE PANEL DE MANTENIMIENTOS */
import { obtenerMantenimientos, publicarMantenimientos, eliminarMantenimiento } from '../../services/Paneles/panelMantenimientoSer.js';

// Pedimos los datos de los mantenimientos
const getMantenimientos = async (req, res) => {
    try {
        const mantenimientos = await obtenerMantenimientos();
        res.json(mantenimientos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("Error al obtener los datos");
    }
};

// Agregamos un nuevo mantenimiento
const postMantenimientos = async (req, res) => {
    try {
        const { festimada, economico } = req.body;
        console.log('req.body');
        console.log(req.body);
        console.log('2');
        
        await publicarMantenimientos(festimada, economico);

        res.status(200).json({ message: 'Mantenimiento agregado exitosamente' });

    } catch (error) {
        console.error('Error agregando nuevos datos:', error);
        res.status(500).json({ message: 'Error agregando nuevos datos' });
    }
};

// Eliminamos un mantenimiento
const deleteMantenimiento = async (req, res) => {
    try {
        const { id } = req.body;
        await eliminarMantenimiento(id);
        res.status(200).json({ message: 'Mantenimiento eliminado exitosamente' });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error eliminando datos' });
        console.error('Error al eliminar los datos', error);
    }
};

export const methods = {
    getMantenimientos, postMantenimientos, deleteMantenimiento
};