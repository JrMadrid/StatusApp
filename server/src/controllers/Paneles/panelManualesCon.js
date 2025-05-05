/* CONTROLADORES DE PANEL DE MANUALES */
import dbConnection from '../../db/connection.js';
import sql from 'mssql';
import { comprobarID } from '../../models/Paneles/manualMod.js';

// Pedimos los datos de los manuales
const getManuales = async (req, res) => {
    if (req.session.hasOwnProperty('admin')) {
        try {
            await dbConnection();
            let result = await sql.query(`SELECT id, nombre, descripcion FROM manuales`);
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
    } else {
        res.redirect('');
    }
};

// Agregamos un nuevo manual
const postManual = async (req, res) => {
    try {
        const { descripcion = '', nombre = '', documento } = req.body;
        const manual = req.file.buffer;

        await dbConnection();

        const query = 'INSERT INTO manuales(nombre, descripcion, manual) VALUES (@nombre, @descripcion, CONVERT(VARBINARY(MAX), @manual))';
        const request = new sql.Request();
        
        request.input('manual', sql.VarBinary(sql.MAX), manual); // sql.VarBinary(sql.MAX) para el tamaño máximo de VARBINARY -- varbinary(max) sirve para almacenar archivos grandes
        if (nombre.length === 0) {
            request.input('nombre', sql.VarChar, documento.toString());
        } else {
            request.input('nombre', sql.VarChar, nombre);
        }
        request.input('descripcion', sql.VarChar, descripcion);

        await request.query(query);

        res.status(200).json({ message: 'Manual agregado exitosamente' });

    } catch (error) {
        console.error('Error agregando nuevos datos:', error);
        res.status(500).json({ message: 'Error agregando nuevos datos' });
    } finally {
        try {
            await sql.close();
        } catch (closeError) {
            console.error('Error al cerrar la conexión:', closeError);
        }
    }
};

// Eliminamos un manual
const deleteManual = async (req, res) => {
    if (req.session.admin) {
        try {
            const { id } = req.body;
            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontro el ID' });
                return;
            }
            await dbConnection();
            const query = 'DELETE FROM manuales WHERE id = @id';
            const request = new sql.Request();

            request.input('id', sql.Numeric, id);

            await request.query(query);
            res.status(200).json({ message: 'Manual eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error eliminando datos' });
            console.error('Error al eliminar los datos', error);
        } finally {
            try {
                await sql.close();
            } catch (errorError) {
                console.error('Error al cerrar la conexión', closeError);
            }
        }
    } else {
        res.redirect('');
    }
};

// Actualizamos un manual
const updateManual = async (req, res) => {
    if (req.session.admin) {
        try {
            const { nombre, descripcion, id } = req.body;
            const updates = [];

            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontro el ID' });
                return;
            }
            if (nombre.length !== 0) {
                updates.push('nombre = @nombre');
            }
            if (descripcion.length !== 0) {
                updates.push('descripcion = @descripcion');
            }

            if (updates.length === 0) {
                res.status(400).json({ message: 'No hay datos para actualizar' });
                return;
            }
            const query = `UPDATE manuales SET ${updates.join(', ')} WHERE id = @id`;

            await dbConnection();
            const request = new sql.Request();

            request.input('nombre', sql.VarChar, nombre);
            request.input('descripcion', sql.VarChar, descripcion);
            request.input('id', sql.Numeric, id);
            await request.query(query);
            res.status(200).json({ message: 'Manual actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar los datos', error);
            res.status(500).json({ message: 'Error actualizando datos' });
        } finally {
            try {
                await sql.close();
            } catch (errorError) {
                console.error('Error al cerrar la conexión', closeError);
            }
        }
    }
    else {
        res.redirect('');
    }
};

// Pedimos el manual en formato PDF
const Manual = async (req, res) => {
    if (req.session.admin) {
        try {
            const id = req.params.id
            await dbConnection();
            const query = 'SELECT manual FROM manuales WHERE id = @id';
            const request = new sql.Request();
            request.input('id', sql.VarChar, id);
            const resultado = await request.query(query);
            if (resultado.recordset.length > 0) {
                const archivo = resultado.recordset[0].manual;
                res.set('Content-Type', 'application/pdf'); // Cambia el tipo de contenido a PDF
                res.set('Content-Disposition', `inline; filename="manual.pdf"`); // Cambia el nombre del archivo si es necesario
                res.status(200).send(archivo);
            }
        } catch (error) {
            console.error('Error al comprobar el ID:', error);
            throw error;
        } finally {
            try {
                await sql.close();
            } catch (errorError) {
                console.error('Error al cerrar la conexión', closeError);
            }
        }
    } else {
        res.redirect('');
    }
};

export const methods = {
    getManuales, postManual, updateManual, deleteManual, Manual
};