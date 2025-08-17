/* CONTROLADORES DE PANEL DE INFORMES */
import { obtenerInformes, publicarInforme, eliminarInforme, archivoInforme } from '../../services/Paneles/panelInformeSer.js';
import { SchemaAgregarInforme, SchemaEliminarInforme } from '../../validators/Paneles/panelInformeVal.js';

// Pedir los datos de los informes
const getInformes = async (req, res) => {
    try {
        const responsable = req.session.user;
        const tipo = req.session.tipo;
        let informes = await obtenerInformes(tipo, responsable);
        res.status(200).json(informes);
    } catch (error) {
        console.error('Error: // Pedir los datos de los informes, ', error);
        res.status(error?.code || 500).json({ message: error?.message || "Error al obtener los datos" });
    }
};

// Agregar un nuevo informe -- Geografia
const postInforme = async (req, res) => {
    try {
        const { descripcion = '', nombre = '', documento, frealizada, economico } = req.body;
        const informe = req.file.buffer;

        const { error } = SchemaAgregarInforme.validate(req.body, { abortEarly: false });
        if (error) {
            const erroresUnidos = error.details.map(err => err.message).join('\n');
            return res.status(400).json({ message: erroresUnidos });
        }
        const ingeniero = req.session.user;
        await publicarInforme(descripcion, nombre, documento, frealizada, economico, informe, ingeniero);

        res.status(200).json({ message: 'Informe agregado exitosamente' });

    } catch (error) {
        console.error('Error: // Agregar un nuevo informe, ', error);
        res.status(error?.code || 500).json({ message: error?.message || 'Error agregando nuevo informe' });
    }
};

// Eliminar un informe -- Administradores
const deleteInforme = async (req, res) => {
    try {
        const { id } = req.body;

        const { error } = SchemaEliminarInforme.validate(req.body, { abortEarly: false });
        if (error) {
            const erroresUnidos = error.details.map(err => err.message).join('\n');
            return res.status(400).json({ message: erroresUnidos });
        }

        await eliminarInforme(id);
        res.status(200).json({ message: 'Informe eliminado exitosamente' });
    } catch (error) {
        console.error('Error: // Eliminar un informe, ', error);
        res.status(error?.code || 500).json({ message: error?.message || 'Error eliminando informe' });
    }
};

// Pedir el informe en formato PDF
const Informe = async (req, res) => {
    try {
        const id = req.params.id

        const documento = await archivoInforme(id);
        if (documento.informe) {
            return res.sendStatus(404);
        }
        res.set('Content-Type', 'application/pdf'); // Cambia el tipo de contenido a PDF
        res.set('Content-Disposition', `inline; filename="informe.pdf"`); // Cambia el nombre del archivo si es necesario
        res.status(200).send(documento.informe);
    } catch (error) {
        console.error('Error: // Pedir el informe en formato PDF, ', error);
        res.status(error?.code || 500).json({ message: error?.message || 'Error con el informe' });
    }
};

export const methods = { getInformes, postInforme, deleteInforme, Informe };