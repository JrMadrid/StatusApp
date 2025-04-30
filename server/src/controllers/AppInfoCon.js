/* CONTROLADORES DE INFORME -- SUCURSAL */
import dbConnection from '../db/connection.js';
import sql from 'mssql'
import ping from 'ping';
import { UPSssh, UPSHardware, UPSDescripcion } from '../connection/UPSssh.js';
import { ILOssh, ILOHardware, ILODescripcion } from '../connection/ILOssh.js';
import { BIOMETRICOtcpip, BiometricoHardware } from '../connection/BIOMETRICOtcpip.js';
import { BIOMETRICOsolicitud } from '../datos/Solicitudes/SolBiometricos.js';

// Pide el número económico
const economico = async (req, res) => {
    try {
        if (req.session.admin != undefined) { // Verifica si hay sesión activa de administrador
            const numero = req.params.economico; // Obtiene el número económico de la URL
            req.session.numero = numero; // Guarda el número económico en la sesión
            req.session.save(err => { // Guarda la sesión y maneja posibles errores
                if (err) {
                    console.error('Error al guardar la sesión:', err);
                }
            });
        } else {
            res.redirect(''); // Redirige si no hay sesión
        }
    } catch (error) {
        console.error('Error :', error);
    }
}

// Consulta y retorna los dispositivos registrados por número económico
const aplicaciones = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            await dbConnection(); // Conecta a la base de datos
            const economico = req.session.numero; // Recupera el número económico de la sesión

            // Consulta los dispositivos asociados al número económico
            const query = `
                SELECT dispo.nombre AS nombre, dispo.ip AS ip, dispo.economico AS economico, 
                       sucu.nombre AS sucursal, sucu.ingresponsable as ingresponsable 
                FROM dispositivos dispo 
                INNER JOIN sucursales sucu ON dispo.economico = sucu.economico 
                WHERE dispo.economico = @economico
            `;
            const request = new sql.Request();
            request.input('economico', sql.VarChar, economico); // Inyecta el valor a la consulta

            const aplicaciones = await request.query(query); // Ejecuta la consulta

            return res.json(aplicaciones.recordset) // Retorna el resultado en formato JSON

        } catch (error) {
            console.error('Error :', error);
        } finally {
            try {
                await sql.close(); // Cierra la conexión SQL
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('')
    }
}

// Obtiene la información general de un dispositivo en específico por su IP
const info = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            let sshInfo; // Variable para almacenar la información que se obtenga vía SSH o TCP/IP
            const ip = req.params.ip; // Se obtiene la IP desde los parámetros de la URL

            req.session.aplicacionip = ip; // Guarda la IP en sesión
            await dbConnection();

            // Consulta el tipo de dispositivo asociado a la IP
            const dispositivo = (await sql.query(`SELECT nombre FROM dispositivos WHERE ip = '${ip}'`)).recordset[0].nombre;
            req.session.aplicacion = dispositivo; // Guarda el nombre del dispositivo en la sesión

            // Dependiendo del tipo de dispositivo, realiza la conexión correspondiente
            if (dispositivo === 'UPS') {
                sshInfo = await UPSssh(ip);
            }
            if (dispositivo === 'Biometrico') {
                sshInfo = await BIOMETRICOtcpip(ip);
            }

            await dbConnection();

            // Consulta información general y de la sucursal del dispositivo
            const dbInfo = await sql.query(`
                SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable as ingresponsable, 
                       dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.ip as ip, dispo.general as general 
                FROM sucursales sucu 
                INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico 
                WHERE dispo.ip = '${ip}'
            `);

            // Se fusiona la información de la base de datos con la obtenida por SSH/TCP
            const Infos = Object.assign({}, sshInfo, dbInfo.recordset[0]);
            const Info = [Infos];

            res.json(Info); // Retorna la información combinada
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        } finally {
            try {
                await sql.close(); // Cierra la conexión SQL
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('')
    }
}

// Recorre los dispositivos de una sucursal y actualiza la información si es necesario
const dispositivos = async (req, res) => {
    if (req.session.admin != undefined) {
        try {
            await dbConnection();
            const economico = req.session.numero; // Obtiene el número económico de la sesión

            // Consulta todos los dispositivos válidos de la sucursal
            const dbInfo = await sql.query(`
                SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable as ingresponsable, 
                       dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.ip AS ip, dispo.general as general 
                FROM sucursales sucu 
                INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico 
                WHERE sucu.economico ='${economico}' 
                AND dispo.ip NOT LIKE '000.%' 
                AND dispo.ip NOT LIKE '001.%'
            `);

            // Recorre cada dispositivo para validar y actualizar la información faltante
            for (let i = 0; i < dbInfo.recordset.length; i++) {
                let ip = dbInfo.recordset[i].ip;

                // Verifica que la IP sea válida
                if (!ip.startsWith('000.') || !ip.startsWith('001.')) {

                    // Si el campo "general" está vacío o nulo, se actualiza
                    if (dbInfo.recordset[i].general === null || dbInfo.recordset[i].general === '') {
                        let sshInfo = '';
                        let general = '';

                        // Solo realiza la conexión SSH si es una UPS
                        if (dbInfo.recordset[i].nombre === 'UPS') {
                            sshInfo = await UPSHardware(ip);
                            general = sshInfo.informaciongeneral;
                        }
                        // Conexiones futuras para ILO o Biometrico están comentadas

                        await dbConnection();
                        // Actualiza el campo "general" en la base de datos
                        await sql.query(`UPDATE dispositivos SET general = '${general}' WHERE ip = '${ip}'`);
                    }

                    // Si el campo "descripcion" está vacío o nulo, se actualiza
                    if (dbInfo.recordset[i].descripcion === null || dbInfo.recordset[i].descripcion === '') {
                        let sshInfo = '';
                        let descripcion = '';

                        // Solo realiza la conexión SSH si es una UPS
                        if (dbInfo.recordset[i].nombre === 'UPS') {
                            sshInfo = await UPSDescripcion(ip);
                            descripcion = sshInfo.descripcion;
                        }

                        await dbConnection();
                        // Actualiza el campo "descripcion" en la base de datos
                        await sql.query(`UPDATE dispositivos SET descripcion = '${descripcion}' WHERE ip = '${ip}'`);
                    }
                }
            }
            res.json(dbInfo.recordset); // Retorna la información actualizada de los dispositivos
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        } finally {
            try {
                await sql.close(); // Cierra la conexión SQL
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('')
    }
};

// Enviar solicitudes o comandos al biométrico
const solicitudes = async (req, res) => {
    try {
        // Solo se permite si la aplicación actual en sesión es un biométrico
        if (req.session.aplicacion === 'Biometrico') {
            const ip = req.session.aplicacionip; // Recupera la IP desde la sesión
            const comando = req.body.id; // Obtiene el comando desde el body de la solicitud
            const mensaje = await BIOMETRICOsolicitud(ip, comando); // Ejecuta la solicitud al biométrico

            res.json(mensaje); // Retorna la respuesta del biométrico
        }
    } catch (error) {
        console.error('Error al ejecutar la solicitud:', error);
    }
};

// Exporta los métodos como un objeto para su uso en rutas
export const methods = {
    info,
    economico,
    aplicaciones,
    dispositivos,
    solicitudes
};