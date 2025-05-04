/* CONTROLADORES DE INFORME --  INFORMES */
import dbConnection from '../../db/connection.js';
import sql from 'mssql'

// Pide el id del informe
const verid = async (req, res) => {
    try {
        if (req.session.admin != undefined) {
            const verinformeid = req.params.id;
            req.session.verinforme = verinformeid;
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

// Manda los datos del informe
const informeinfo = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            await dbConnection();
            const informeid = req.session.verinforme;
            let query = `SELECT nombre, descripcion FROM informes WHERE id = ${informeid}`;
            const request = new sql.Request();

            const informeinfo = await request.query(query);

            return res.status(200).json(informeinfo.recordset);

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

// Manda el informe
const informe = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            await dbConnection();
            const informeid = req.session.verinforme;
            let informeAr = await sql.query(`SELECT informe FROM informes WHERE id = ${informeid}`)

            if (informeAr.recordset.length > 0) {
                const archivo = informeAr.recordset[0].informe;
            
                res.set('Content-Type', 'application/pdf'); // Cambia el tipo de contenido a PDF
                res.set('Content-Disposition', `inline; filename="informe.pdf"`); // Cambia el nombre del archivo a descargar
                res.status(200).send(archivo);
                
            } else {
                res.status(404).json({ message: 'Archivo no encontrado' });
            }
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

export const methods = {
    verid, informeinfo, informe
};