/* CONTROLADORES DE PANEL DE MANTENIMIENTOS */
// import dbConnection from '../../db/connection.js';
import sql from 'mssql';
import { SucursalExiste, comprobarFechaEstimada, comprobarID } from '../../models/Paneles/panelMantenimientoMod.js';

// Pedimos los datos de los mantenimientos
const getMantenimientos = async (req, res) => {
    if (req.session.admin) {
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const result = await sql.query('SELECT mant.id as id, sucu.economico as economico, sucu.canal as canal, sucu.nombre as sucursal, sucu.ingresponsable as ingresponsable, mant.fechaestimada as festimada, mant.fecharealizada as frealizada, mant.descripcion as descripcion FROM sucursales sucu INNER JOIN mantenimiento mant ON sucu.economico = mant.economico WHERE sucu.economico != 000000 ORDER BY sucu.canal ASC, sucu.nombre ASC, mant.fechaestimada DESC ');
            res.json(result.recordset);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        } finally {
            try {
                await sql.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('');
    }
};

// Agregamos un nuevo mantenimiento
const postMantenimientos = async (req, res) => {
    if (req.session.admin) {
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const { festimada, economico } = req.body;
            // Validar los campos
            const festimadamayor = await comprobarFechaEstimada(festimada);
            if (!festimadamayor) {
                res.status(400).json({ message: 'Fecha estimada menor a 01/Enero/2024' });
                return;
            }
            const isEconomicoValid = await SucursalExiste(economico)
            if (!isEconomicoValid) {
                res.status(404).json({ message: 'No se encontro la sucursal (economico no valido)' });
                return;
            }

            const query = 'INSERT INTO mantenimiento(fechaestimada, economico) VALUES (@fechaestimada, @economico)';
            const request = new sql.Request();

            request.input('fechaestimada', sql.Date, festimada);
            request.input('economico', sql.VarChar, economico);

            await request.query(query);
            res.status(200).json({ message: 'Mantenimiento agregado exitosamente' });

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
    } else {
        res.redirect('');
    }
};

// Eliminamos un mantenimiento
const deleteMantenimiento = async (req, res) => {
    if (req.session.admin) {
        try {
            const { id } = req.body;
            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontro el ID' });
                return;
            }
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const query = 'DELETE FROM mantenimiento WHERE id = @id';
            const request = new sql.Request();
        
            request.input('id', sql.Numeric, id);

            await request.query(query);
            res.status(200).json({ message: 'Mantenimiento eliminado exitosamente' });
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

export const methods = {
    getMantenimientos, postMantenimientos, deleteMantenimiento
};