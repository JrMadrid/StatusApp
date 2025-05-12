/* CONTROLADORES DE PANEL DE INFORMES */
import sql from 'mssql';
import { obtenerInformes, publicarInforme, eliminarInforme, archivoInforme } from '../../services/Paneles/panelInformeSer.js';

// Pedimos los datos de los informes
const getInformes = async (req, res) => {
    if (req.session.hasOwnProperty('admin')) {
        try {
            const responsable = req.session.user;
            const tipo = req.session.tipo;
            let informes = await obtenerInformes(tipo, responsable);
            res.status(200).json(informes);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
    } else {
        res.redirect('');
    }
};

// Agregamos un nuevo informe
const postInforme = async (req, res) => {
    try {
        const { descripcion = '', nombre = '', documento, frealizada, economico } = req.body;
        const informe = req.file.buffer;

        await publicarInforme(descripcion, nombre, documento, frealizada, economico, informe);

        res.status(200).json({ message: 'Informe agregado exitosamente' });

    } catch (error) {
        console.error('Error agregando nuevos datos:', error);
        res.status(500).json({ message: 'Error agregando nuevos datos' });
    }
};

// Eliminamos un informe
const deleteInforme = async (req, res) => {
    if (req.session.admin) {
        try {
            const { id } = req.body;
            await eliminarInforme(id);
            res.status(200).json({ message: 'Informe eliminado exitosamente' });
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message || 'Error agregando nuevos datos' });
            console.error('Error al eliminar los datos', error);
        }
    } else {
        res.redirect('');
    }
};

// Pedimos el informe en formato PDF
const Informe = async (req, res) => {
    if (req.session.hasOwnProperty('admin')) {
        try {
            const id = req.params.id

            const informe = await archivoInforme(id);
            if (informe.length > 0) {
                const archivo = informe[0].informe;
                res.set('Content-Type', 'application/pdf'); // Cambia el tipo de contenido a PDF
                res.set('Content-Disposition', `inline; filename="informe.pdf"`); // Cambia el nombre del archivo si es necesario
                res.status(200).send(archivo);
            }
        } catch (error) {
            console.error('Error al comprobar el ID:', error);
            throw error;
        }
    } else {
        res.redirect('');
    }
};

export const methods = {
    getInformes, postInforme, deleteInforme, Informe
};