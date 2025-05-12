/* CONTROLADORES DE PANEL DE MANTENIMIENTOS */
import { obtenerMantenimientos, eliminarMantenimiento } from '../../services/Paneles/panelMantenimientoSer.js';

// Pedimos los datos de los mantenimientos
const getMantenimientos = async (req, res) => {
    if (req.session.admin) {
        try {
            const mantenimientos = await obtenerMantenimientos();
            res.json(mantenimientos);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
    } else {
        res.redirect('');
    }
};

// Agregamos un nuevo mantenimiento
const postMantenimientos = async (req, res) => {
    if (req.session.admin) {
        try {
            const { festimada, economico } = req.body;
            await publicarMantenimientos(festimada, economico);

            res.status(200).json({ message: 'Mantenimiento agregado exitosamente' });

        } catch (error) {
            console.error('Error agregando nuevos datos:', error);
            res.status(500).json({ message: 'Error agregando nuevos datos' });
        }
    } else {
        res.redirect('');
    }
};

// Eliminamos un mantenimiento
const deleteMantenimiento = async (req, res) => {
    if (req.session.admin) {
        try {
            const { id } = req.body;
            await eliminarMantenimiento(id);
            res.status(200).json({ message: 'Mantenimiento eliminado exitosamente' });
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message || 'Error eliminando datos' });
            console.error('Error al eliminar los datos', error);
        }
    } else {
        res.redirect('');
    }
};

export const methods = {
    getMantenimientos, postMantenimientos, deleteMantenimiento
};