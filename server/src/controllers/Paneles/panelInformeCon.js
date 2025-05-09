/* CONTROLADORES DE PANEL DE INFORMES */
// import dbConnection from '../../db/connection.js';
import sql from 'mssql';
import { SucursalExiste, comprobarID } from '../../models/Paneles/panelInformeMod.js';

// Pedimos los datos de los informes
const getInformes = async (req, res) => {
    if (req.session.hasOwnProperty('admin')) {
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const responsable = req.session.user;
            let result;
            if (req.session.tipo === 'Geografia') {
                result = await sql.query(`SELECT infor.id AS id, infor.economico AS economico, sucu.canal as canal, sucu.nombre as sucursal, infor.fecharealizada AS fecharealizada, infor.nombre AS nombre, infor.descripcion AS descripcion FROM informes infor  INNER JOIN sucursales sucu ON sucu.economico = infor.economico WHERE sucu.ingresponsable = '${responsable}'  ORDER BY fecharealizada DESC`);
            }
            else {
                result = await sql.query(`SELECT infor.id AS id, infor.economico AS economico, sucu.canal as canal, sucu.nombre as sucursal, infor.fecharealizada AS fecharealizada, infor.nombre AS nombre, infor.descripcion AS descripcion, sucu.ingresponsable as ingresponsable FROM informes infor INNER JOIN sucursales sucu ON sucu.economico = infor.economico ORDER BY infor.fecharealizada DESC`);
            }
            res.status(200).json(result.recordset);
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

        const isEconomicoValid = await SucursalExiste(economico)
        if (!isEconomicoValid) {
            res.status(404).json({ message: 'No se encontro la sucursal (economico no valido)' });
            return;
        }

        // await dbConnection(); solo se inicia la conexion al arrancar el servidor;

        const query = 'INSERT INTO informes(nombre, descripcion, informe, fecharealizada, economico) VALUES (@nombre, @descripcion, CONVERT(VARBINARY(MAX), @informe), @fecharealizada, @economico)';
        const request = new sql.Request();

        request.input('informe', sql.VarBinary(sql.MAX), informe); // sql.VarBinary(sql.MAX) para el tamaño máximo de VARBINARY -- varbinary(max) sirve para almacenar archivos grandes
        if (nombre.length === 0) {
            request.input('nombre', sql.VarChar, documento.toString());
        } else {
            request.input('nombre', sql.VarChar, nombre);
        }
        request.input('descripcion', sql.VarChar, descripcion);
        request.input('fecharealizada', sql.Date, frealizada);
        request.input('economico', sql.VarChar, economico);

        await request.query(query);

        res.status(200).json({ message: 'Informe agregado exitosamente' });

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

// Eliminamos un informe
const deleteInforme = async (req, res) => {
    if (req.session.admin) {
        try {
            const { id } = req.body;
            const IdExiste = await comprobarID(id)
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontro el ID' });
                return;
            }
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const query = 'DELETE FROM informes WHERE id = @id';
            const request = new sql.Request();

            request.input('id', sql.Numeric, id);

            await request.query(query);
            res.status(200).json({ message: 'Informe eliminado exitosamente' });
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

// Pedimos el informe en formato PDF
const Informe = async (req, res) => {
    if (req.session.hasOwnProperty('admin')) {
        try {
            const id = req.params.id
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const query = 'SELECT informe FROM informes WHERE id = @id';
            const request = new sql.Request();
            request.input('id', sql.VarChar, id);
            const resultado = await request.query(query);
            if (resultado.recordset.length > 0) {
                const archivo = resultado.recordset[0].informe;
                res.set('Content-Type', 'application/pdf'); // Cambia el tipo de contenido a PDF
                res.set('Content-Disposition', `inline; filename="informe.pdf"`); // Cambia el nombre del archivo si es necesario
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
    getInformes, postInforme, deleteInforme, Informe
};