/* MODEL PARA VALIDAR DATOS DE INFORMES */
import sql from 'mssql';

export const getInformes = async (tipo, responsable) => {
    let query;
    let request = new sql.Request();
    request.input('responsable', sql.VarChar, responsable);
    if (tipo === 'Geografia') {
        query = `SELECT infor.id AS id, infor.economico AS economico, sucu.canal as canal, sucu.nombre as sucursal,
                        infor.fecharealizada AS fecharealizada, infor.nombre AS nombre, infor.descripcion AS descripcion 
                FROM informes infor 
                INNER JOIN sucursales sucu ON sucu.economico = infor.economico 
                WHERE sucu.ingresponsable = @responsable 
                ORDER BY fecharealizada DESC`;
    }
    else {
        query = `SELECT infor.id AS id, infor.economico AS economico, sucu.canal as canal, sucu.nombre as sucursal,
                        infor.fecharealizada AS fecharealizada, infor.nombre AS nombre, infor.descripcion AS descripcion, sucu.ingresponsable as ingresponsable 
                FROM informes infor 
                INNER JOIN sucursales sucu ON sucu.economico = infor.economico 
                ORDER BY infor.fecharealizada DESC`;
    }
    let result = await request.query(query);
    return result.recordset;
};

export const postInforme = async (descripcion, nombre, documento, frealizada, economico, informe) => {
    const request = new sql.Request();
    const query = 'INSERT INTO informes(nombre, descripcion, informe, fecharealizada, economico) VALUES (@nombre, @descripcion, CONVERT(VARBINARY(MAX), @informe), @fecharealizada, @economico)';

    request.input('informe', sql.VarBinary(sql.MAX), informe); // sql.VarBinary(sql.MAX) para el tamaño máximo de VARBINARY -- varbinary(max) sirve para almacenar archivos grandes
    if (nombre.length === 0) {
        request.input('nombre', sql.VarChar, documento.toString());
    } else {
        request.input('nombre', sql.VarChar, nombre);
    }
    request.input('descripcion', sql.VarChar, descripcion);
    request.input('fecharealizada', sql.Date, frealizada);
    request.input('economico', sql.VarChar, economico);

    await request.query(query);
};

export const deleteInforme = async (id) => {
    const request = new sql.Request();
    request.input('id', sql.Numeric, id);
    const query = 'DELETE FROM informes WHERE id = @id';

    await request.query(query);
};

export const informeArchivo = async (id) => {
    const request = new sql.Request();
    request.input('id', sql.VarChar, id);
    const query = 'SELECT informe FROM informes WHERE id = @id';
    const resultado = await request.query(query);
    return resultado.recordset;
}

/* Comprobar que existe la sucursal antes de cualquier operación con los informes */
async function SucursalExiste(economico) {
    try {
        // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
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
        // await dbConnection(); solo se inicia la conexion al arrancar el servidor
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