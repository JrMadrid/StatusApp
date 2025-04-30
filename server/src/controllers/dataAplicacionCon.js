/* CONTROLADRES DE LA INFORMACIÓN DE LAS APLICACIONES */
import dbConnection from '../db/connection.js';
import sql from 'mssql';

// Pedimos los datos de los dispositivos
const getDispositivos = async (req, res) => {
    if (req.session.hasOwnProperty('admin')) { // Si se ha validado el usuario
        try {
            await dbConnection();
            const responsable = req.session.user;
            let result;
            if (req.session.tipo === 'Aplicativo') {
                result = await sql.query(`SELECT dispo.nombre AS dispositivo, dispo.ip AS ip, sucu.economico AS economico, sucu.canal AS canal, sucu.nombre AS sucursal, sucu.ingresponsable AS ingresponsable FROM sucursales sucu INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico ORDER BY sucu.canal ASC, sucu.nombre ASC`);
            }
            else {
                result = await sql.query(`SELECT dispo.nombre AS dispositivo, dispo.ip AS ip, sucu.economico AS economico, sucu.canal AS canal, sucu.nombre AS sucursal FROM sucursales sucu INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico WHERE sucu.ingresponsable  = '${responsable}' ORDER BY sucu.canal ASC, sucu.nombre ASC`);
            }
            res.json(result.recordset);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
    } else {
        res.redirect('');
    }
};

// Pedimnos la lista de los dispositivos
const getListaDispositivos = async (req, res) => {
    if (req.session.hasOwnProperty('admin')) {
        try {
            await dbConnection();
            const responsable = req.session.user;
            let dispos;
            if (req.session.tipo === 'Geografia') {
                dispos = await sql.query(`SELECT dispo.nombre FROM dispositivos dispo INNER JOIN sucursales sucu ON sucu.economico = dispo.economico WHERE sucu.ingresponsable = '${responsable}' GROUP BY dispo.nombre ORDER BY nombre ASC`);
            }
            else {
                dispos = await sql.query(`SELECT dispo.nombre FROM dispositivos dispo INNER JOIN sucursales sucu ON sucu.economico = dispo.economico GROUP BY dispo.nombre ORDER BY nombre ASC`);
            }
            res.status(200).send(dispos.recordset);

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
    } else {
        res.redirect('');
    }
};

export const methods = {
    getDispositivos, getListaDispositivos
};