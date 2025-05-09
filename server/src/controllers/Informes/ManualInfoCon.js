/* CONTROLADORES DE INFORME -- MANUAL */
// import dbConnection from '../../db/connection.js';
import sql from 'mssql'

// Pide el id del manual
const verid = async (req, res) => {
    try {
        if (req.session.admin != undefined) {
            const vermanualid = req.params.id;
            req.session.vermanual = vermanualid;
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
}

// Manda los datos del manual
const manualinfo = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const manualid = req.session.vermanual;
            let query = `SELECT nombre, descripcion FROM manuales WHERE id = ${manualid}`;
            const request = new sql.Request();

            const manualinfo = await request.query(query);

            return res.status(200).json(manualinfo.recordset);

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

// Manda el manual
const manual = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const manualid = req.session.vermanual;
            let manualAr = await sql.query(`SELECT manual FROM manuales WHERE id = ${manualid}`)

            if (manualAr.recordset.length > 0) {
                const archivo = manualAr.recordset[0].manual;
            
                res.set('Content-Type', 'application/pdf'); // Cambia el tipo de contenido a PDF
                res.set('Content-Disposition', `inline; filename="manual.pdf"`); // Cambia el nombre del archivo a descargar
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
    verid, manualinfo, manual
};