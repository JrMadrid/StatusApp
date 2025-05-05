/* MODEL PARA VALIDAR DATOS DE MANUALES */
import dbConnection from "../../db/connection.js";
import sql from 'mssql';

/* Comprobar que ID del manual existe para corrobar ejecución */
async function comprobarID(id) {
    try {
        await dbConnection();
        const query = 'SELECT id FROM manuales WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id);
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;
    } catch (error) {
        console.error('Error al comprobar el ID:', error);
        throw error;
    }
}

export { comprobarID };