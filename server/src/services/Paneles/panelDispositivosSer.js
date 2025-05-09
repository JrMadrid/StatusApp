/* SERVICIOS PARA VALIDAR DATOS DE DISPOSITIVOS */
// import dbConnection from '../../db/connection.js';
import sql from 'mssql';
import { SucursalExiste, IpOcupada, comprobarID } from '../../models/Paneles/panelDispositivosMod.js';

/* Obtener todos los dispositivos registrados */
export async function obtenerDispositivos() {
    // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
    const query = `
        SELECT 
            dispo.nombre AS dispositivo,
            dispo.ip AS ip,
            sucu.economico AS economico,
            sucu.canal AS canal,
            sucu.nombre AS sucursal,
            sucu.ingresponsable as ingresponsable,
            dispo.id AS id
        FROM sucursales sucu
        INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico
        ORDER BY sucu.canal, sucu.nombre
    `;
    const result = await sql.query(query);
    return result.recordset;
};

/* Agregar un nuevo dispositivo con validaciones */
export async function agregarDispositivo({ economico, ip, nombre, descripcion, general }) {
    const isEconomicoValid = await SucursalExiste(economico);
    if (!isEconomicoValid) throw { code: 404, message: 'Sucursal no válida' };

    const esIpOcupada = await IpOcupada(ip);
    if (esIpOcupada) throw { code: 406, message: 'IP ocupada' };

    // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
    const query = `
        INSERT INTO dispositivos (ip, economico, nombre, descripcion, general)
        VALUES (@ip, @economico, @nombre, @descripcion, @general)
    `;
    const request = new sql.Request();
    request.input('ip', sql.VarChar, ip);
    request.input('economico', sql.VarChar, economico);
    request.input('nombre', sql.VarChar, nombre);
    request.input('descripcion', sql.VarChar, descripcion);
    request.input('general', sql.VarChar, general);
    await request.query(query);
};

/* Actualizar un dispositivo existente */
export async function actualizarDispositivo(data) {
    const { economico, ip, nombre, id, descripcion, general, reiniciar } = data;
    const idExiste = await comprobarID(id);
    if (!idExiste) throw { code: 404, message: 'ID no válido' };

    const updates = [];
    const request = new sql.Request();

    if (economico?.length) {
        if (!(await SucursalExiste(economico))) throw { code: 404, message: 'Sucursal no válida' };
        updates.push('economico = @economico');
        request.input('economico', sql.VarChar, economico);
    }
    if (ip?.length) {
        if (await IpOcupada(ip)) throw { code: 409, message: 'IP ocupada' };
        updates.push('ip = @ip');
        request.input('ip', sql.VarChar, ip);
    }
    if (nombre?.length) {
        updates.push('nombre = @nombre');
        request.input('nombre', sql.VarChar, nombre);
    }
    if (reiniciar === 'yes') {
        updates.push("descripcion = ''", "general = ''");
    } else {
        if (descripcion?.length) {
            updates.push('descripcion = @descripcion');
            request.input('descripcion', sql.VarChar, descripcion);
        }
        if (general?.length) {
            updates.push('general = @general');
            request.input('general', sql.VarChar, general);
        }
    }

    if (!updates.length) throw { code: 400, message: 'Sin cambios válidos' };

    // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
    const query = `UPDATE dispositivos SET ${updates.join(', ')} WHERE id = @id`;
    request.input('id', sql.Int, id);
    await request.query(query);
};

/* Eliminar un dispositivo con seguridad */
export async function eliminarDispositivo(id) {
    const idExiste = await comprobarID(id);
    if (!idExiste) throw { code: 404, message: 'ID no válido' };

    // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
    const transaction = new sql.Transaction();
    await transaction.begin();

    const request = new sql.Request(transaction);
    await request.query('ALTER TABLE info NOCHECK CONSTRAINT FK_info_dispositivos');
    request.input('id', sql.Int, id);
    await request.query('DELETE FROM dispositivos WHERE id = @id');
    await request.query('ALTER TABLE info CHECK CONSTRAINT FK_info_dispositivos');

    await transaction.commit();
};