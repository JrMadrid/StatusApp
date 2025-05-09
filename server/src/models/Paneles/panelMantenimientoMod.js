/* MODEL PARA VALIDAR DATOS DE MANTENIMIENTOS */
// import dbConnection from "../../db/connection.js";
import sql from 'mssql';

/* Comprobar que existe la sucursal antes de cualquier operación con los dispositivos */
async function SucursalExiste(economico) {
    try {
        // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
        const query = 'SELECT economico FROM sucursales WHERE economico = @economico';
        const request = new sql.Request();
        request.input('economico', sql.VarChar, economico);
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;  // La sucursal existe
    } catch (error) {
        console.error('Error al comprobar la sucursal:', error);
        throw error;
    }
}

/* Comprobar que fecha estimada es mayor a 01/Enero/2024 */
async function comprobarFechaEstimada(festimada) {
    try {
        return '2024-01-01' < festimada;
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

/* Comprobar que ID del dispositivo existe para corrobar ejecución */
async function comprobarID(id) {
    try {
        // await dbConnection(); solo se inicia la conexion al arrancar el servidor
        const query = 'SELECT id FROM mantenimiento WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        return resultado.recordset.length > 0; // El ID exite
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

export {
    SucursalExiste, comprobarFechaEstimada, comprobarID
};