/* MODEL PARA VALIDAR DATOS DE USUARIOS */
import dbConnection from "../db/connection.js";
import sql from 'mssql';

/* Evitar modificación del administrador */
async function IDdelAdmin(id) {
    return id === '1'; // ID del super admin
};

/* Comprobar que el nickname no está ocupado */
async function NicknameOcupado(nickname) {
    try {
        await dbConnection();
        const query = 'SELECT nickname FROM users WHERE nickname = @nickname';
        const request = new sql.Request();
        request.input('nickname', sql.VarChar, nickname);
        const resultado = await request.query(query);
        return resultado.recordset.length > 0; // Devuelve `true` si el nickname existe, `false` si no
    } catch (error) {
        console.error('Error al comprobar el nickname:', error);
        throw error; // Re-lanza el error para ser manejado por el consumidor
    }
};

/* Comprobar que ID del usuario existe para corrobar ejecución */
async function comprobarID(id) {
    try {
        await dbConnection();
        const query = 'SELECT id FROM users WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id);
        const resultado = await request.query(query);
        return resultado.recordset.length > 0; // Devuelve `true` si el ID existe, `false` si no
    } catch (error) {
        console.error('Error al comprobar el ID:', error);
        throw error; // Re-lanza el error para ser manejado por el consumidor
    }
}

/* Conocer el nombre del ing. Responsable por su id*/
async function nombreResponsable(id) {
    try {
        await dbConnection();
        const query = 'SELECT nickname FROM users WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id);
        const resultado = await request.query(query);     
        return resultado.recordset[0].nickname;
    } catch (error) {
        console.error('Error: ', error);
        throw error; // Re-lanza el error para ser manejado por el consumidor
    }
}

export { IDdelAdmin, NicknameOcupado, comprobarID, nombreResponsable };