/* CONTROLADORES DE PANEL DE DISPOSITIVOS */
import dbConnection from '../db/connection.js';
import pingHost from '../connection/PING.js';
import sql from 'mssql';
import { SucursalExiste, IpOcupada, comprobarID } from '../models/appsMod.js';

// Pedimos los datos de los dispositivos
const getApps = async (req, res) => {
    if (req.session.admin) {
        try {
            await dbConnection();
            const result = await sql.query('SELECT dispo.nombre AS dispositivo, dispo.ip AS ip,sucu.economico AS economico, sucu.canal AS canal, sucu.nombre AS sucursal, sucu.ingresponsable as ingresponsable, dispo.id AS id FROM sucursales sucu INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico ORDER BY sucu.canal ASC, sucu.nombre ASC ');
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

// Agregamos un nuevo dispositivo
const postApp = async (req, res) => {
    if (req.session.admin) {
        try {
            const { economico, ip, nombre, descripcion, general } = req.body;
            // Validar los campos
            const isEconomicoValid = await SucursalExiste(economico);
            if (!isEconomicoValid) {
                res.status(404).json({ message: 'No se encontro la sucursal (economico no valido)' });
                return;
            };
            const EsIpOcupada = await IpOcupada(ip);
            if (EsIpOcupada) {
                res.status(406).json({ message: 'La IP definida ya se encuentra en la base de datos' });
                return;
            };

            const query = 'INSERT INTO dispositivos (ip, economico, nombre, descripcion, general) VALUES (@ip, @economico, @nombre, @descripcion, @general)';
            const request = new sql.Request();
            
            request.input('ip', sql.VarChar, ip);
            request.input('economico', sql.VarChar, economico);
            request.input('nombre', sql.VarChar, nombre);
            request.input('descripcion', sql.VarChar, descripcion);
            request.input('general', sql.VarChar, general);
            await request.query(query);
            res.status(200).json({ message: 'Dispositivo agregado exitosamente' });
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

// Actualizamos un dispositivo
const patchApp = async (req, res) => {
    if (req.session.admin) {
        try {
            const { economico, ip, nombre, id, descripcion, general, reiniciar } = req.body;
            const updates = [];

            // Validar los campos
            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontro el ID' });
                return;
            }
            if (economico.length !== 0) {
                const LaSucursalExiste = await SucursalExiste(economico);
                if (LaSucursalExiste) {
                    updates.push('economico = @economico');
                } else {
                    res.status(404).json({ message: 'No se encontro la sucursal (economico no valido)' });
                    return;
                }
            }
            if (ip.length !== 0) {
                const EsIpOcupada = await IpOcupada(ip);
                if (!EsIpOcupada) {
                    updates.push('ip = @ip');
                } else {
                    res.status(409).json({ message: 'La IP definida ya se encuentra en la base de datos' });
                    return;
                }
            }
            if (nombre.length !== 0) {
                updates.push('nombre = @nombre');
            }
            if (descripcion.length !== 0) {
                if (reiniciar !== 'yes') {
                    updates.push('descripcion = @descripcion');
                }
            }
            if (general.length !== 0) {
                if (reiniciar !== 'yes') {
                    updates.push('general = @general');
                }
            }
            if (reiniciar === 'yes') {
                updates.push("descripcion = ''");
                updates.push("general = ''");
            }
            if (updates.length === 0) {
                res.status(400).json({ message: 'No hay datos para actualizar' });
                return;
            }
            const query = `UPDATE dispositivos SET ${updates.join(', ')} WHERE id = @id`;

            await dbConnection();
            const request = new sql.Request();

            request.input('economico', sql.VarChar, economico);
            request.input('ip', sql.VarChar, ip);
            request.input('nombre', sql.VarChar, nombre);
            request.input('descripcion', sql.VarChar, descripcion);
            request.input('general', sql.VarChar, general);
            request.input('id', sql.Numeric, id);
            await request.query(query);
            res.status(200).json({ message: 'Dispositivo actualizado exitosamente' });
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

// Eliminamos un dispositivo
const deleteApp = async (req, res) => {
    if (req.session.admin) {
        let transaction
        try {
            const { id } = req.body;
            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontro el ID' });
                return;
            }

            await dbConnection();
        
            transaction = new sql.Transaction();
            await transaction.begin();

            const request = new sql.Request(transaction);
            await request.query('ALTER TABLE info NOCHECK CONSTRAINT FK_info_dispositivos');
            const query = 'DELETE FROM dispositivos WHERE id = @id';
        
            request.input('id', sql.Numeric, id);
            await request.query(query);
            await request.query('ALTER TABLE info CHECK CONSTRAINT FK_info_dispositivos');
            await transaction.commit();

            res.status(200).json({ message: 'Dispositivo eliminado exitosamente' });
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

// Hacemos un ping a la ip
const ping = async (req, res) => {
    try {
        if (req.session.admin != undefined) {
            const host = req.params.ip;
            const PING = await pingHost(host);
            res.status(200).json(PING)
        } else {
            res.redirect('');
        }
    } catch (error) {
        console.error('Error :', error);
    }
};

export const methods = {
    getApps, postApp, patchApp, deleteApp, ping
};