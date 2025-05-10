/* CONTROLADORES DE INFORME -- MANTENIMIENTO */
import sql from 'mssql';

// Manda las fechas vinculadas al economico
const economico = async (req, res) => {
    try {
        if (req.session.admin != undefined) {
            const numero = req.params.economico;
            req.session.numeroMante = numero;
            req.session.save(err => {
                if (err) {
                    console.error('Error al guardar el numero economico:', err);
                }
            });

        } else {
            res.redirect('');
        }
    } catch (error) {
        console.error('Error :', error);
    }
};

// Manda las fechas vinculadas al economico
const fechasr = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const economico = req.session.numeroMante;

            const query = 'SELECT mante.fecharealizada AS realizado, mante.economico AS economico, sucu.nombre AS sucursal, sucu.ingresponsable as ingresponsable FROM mantenimiento mante INNER JOIN sucursales sucu ON mante.economico = sucu.economico WHERE mante.economico = @economico ORDER BY mante.fecharealizada DESC';
            const request = new sql.Request();

            request.input('economico', sql.VarChar, economico);

            const fechasr = await request.query(query);

            return res.status(200).json(fechasr.recordset);

        } catch (error) {
            console.error('Error :', error);

        } 
    } else {
        res.redirect('');
    }
};

// Manda el archivo de la constancia de la fecha seleccionada
const info = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            const fechasr = req.params.fechasr;
            if (fechasr && fechasr !== null && fechasr !== 'null') {
                // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            
                const economico = req.session.numeroMante;

                const constanciaAr = await sql.query(`SELECT constancia FROM mantenimiento WHERE fecharealizada = '${fechasr}' AND economico = '${economico}'`);

                if (constanciaAr.recordset.length > 0) {
                    const archivo = constanciaAr.recordset[0].constancia;
                
                    res.set('Content-Type', 'image/jpeg'); // Cambia el tipo de contenido a JPEG
                    res.set('Content-Disposition', `inline; filename="constancia.jpg"`); // Cambia el nombre del archivo a descargar
                
                    res.status(200).send(archivo);
                } else {
                    res.status(404).json({ message: 'Archivo no encontrado' });
                }
            } else {
                return res.status(400).json({ message: 'Fecha no valida' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        } 
    } else {
        res.redirect('');
    }
};

// Manda todas las constancias
const infos = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const economico = req.session.numeroMante

            const constancias = await sql.query(`SELECT constancia FROM mantenimiento WHERE economico = '${economico}' AND constancia IS NOT NULL`);

            if (constancias.recordset.length > 0) {            
                const archivos = constancias.recordset.map(item => {
                    return item.constancia;
                });
                res.status(200).json(archivos);
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        } 
    } else {
        res.redirect('');
    }
};

export default {
    economico, fechasr, info, infos
};