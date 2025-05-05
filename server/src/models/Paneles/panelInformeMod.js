/* MODEL PARA VALIDAR DATOS DE INFORMES */
import dbConnection from "../../db/connection.js";
import sql from 'mssql';

/* Comprobar que existe la sucursal antes de cualquier operación con los informes */
async function SucursalExiste(economico) {
    try {
        await dbConnection();
        const query = 'SELECT economico FROM sucursales WHERE economico = @economico';
        const request = new sql.Request();
        request.input('economico', sql.VarChar, economico)
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al comprobar la sucursal:', error);
        throw error;
    }
}

/* Comprobar que ID del informe existe para corrobar ejecución */
async function comprobarID(id) {
    try {
        await dbConnection()
        const query = 'SELECT id FROM informes WHERE id = @id'
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

export { SucursalExiste, comprobarID };