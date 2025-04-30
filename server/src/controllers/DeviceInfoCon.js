/* CONTROLADORES DE INFORME -- DISPOSITIVOS */
import dbConnection from '../db/connection.js';
import sql from 'mssql';

// Pide el nombre
const nombre = async (req, res) => {
    try {
        if (req.session.admin != undefined) {
            const dispositivo = req.params.nombre;
            req.session.dispositivo = dispositivo;
            req.session.save(err => {
                if (err) {
                    console.error('Error al guardar la sesión:', err);
                }
            });
        } else {
            res.redirect('');
        }
    } catch (error) {
        console.error('Error :', error);
    }
};

// Manda los dispositivos con ese nombre
const dispositivos = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            await dbConnection();
            const dispositivo = req.session.dispositivo;
            const responsable = req.session.user;
            let query;
            if (req.session.tipo === 'Geografia') {
                query = `SELECT dispo.nombre as nombre, dispo.ip as ip, sucu.nombre as sucursal, sucu.economico as economico FROM dispositivos dispo INNER JOIN sucursales sucu ON dispo.economico = sucu.economico WHERE dispo.nombre = @dispositivo AND sucu.ingresponsable  = '${responsable}' ORDER BY sucu.canal ASC, sucu.nombre ASC `;
            } else {
                query = `SELECT dispo.nombre as nombre, dispo.ip as ip, sucu.nombre as sucursal, sucu.economico as economico FROM dispositivos dispo INNER JOIN sucursales sucu ON dispo.economico = sucu.economico WHERE dispo.nombre = @dispositivo ORDER BY sucu.canal ASC, sucu.nombre ASC `;
            }
            const request = new sql.Request();
            request.input('dispositivo', sql.VarChar, dispositivo);

            const dispositivos = await request.query(query);

            return res.status(200).json(dispositivos.recordset);

        } catch (error) {
            console.error('Error :', error);

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

// Consulta para los datos de los dispositivos
const info = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            const dispositivo = req.params.dispo;
            const responsable = req.session.user;
            let result;
            await dbConnection();
            if (req.session.tipo === 'Geografia') {
                result = await sql.query(`SELECT sucu.nombre AS sucursal, sucu.economico AS economico, dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.general as general, dispo.ip AS ip FROM sucursales sucu INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico WHERE dispo.nombre = '${dispositivo}' AND sucu.ingresponsable  = '${responsable}' ORDER BY sucu.canal ASC, sucu.nombre ASC `)
            } else {
                result = await sql.query(`SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable as ingresponsable, dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.general as general, dispo.ip AS ip FROM sucursales sucu INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico WHERE dispo.nombre = '${dispositivo}' ORDER BY sucu.canal ASC, sucu.nombre ASC `)
            }
            res.status(200).json(result.recordset);
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

export const methods = {
    info, nombre, dispositivos
};