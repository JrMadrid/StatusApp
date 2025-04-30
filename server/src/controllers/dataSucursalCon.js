/* CONTROLADORES DE LA INFORMACIÓN DE LAS SUCURSALES */
import dbConnection from '../db/connection.js';
import sql from 'mssql'

// Pedimos los datos de las sucursales
const getSucursales = async (req, res) => { 
    if (req.session.hasOwnProperty('admin')) { // sI se ha validado el usuario
        try {
            await dbConnection();
            const responsable = req.session.user;
            let result;
            if (req.session.tipo === 'Aplicativo') {
                result = await sql.query(`SELECT economico, canal, nombre, ingresponsable FROM sucursales WHERE economico != 000000 ORDER BY canal ASC, nombre ASC `);
            }
            else {
                result = await sql.query(`SELECT economico, canal, nombre FROM sucursales WHERE ingresponsable = '${responsable}' ORDER BY canal ASC, nombre ASC `);
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

export default getSucursales;