/* MODEL PARA VALIDAR DATOS DE MANTENIMIENTOS */
import sql from 'mssql';

export const getMantenimientos = async () => {
    const request = new sql.Request();
    const result = await request.query('SELECT mant.id as id, sucu.economico as economico, sucu.canal as canal, sucu.nombre as sucursal, sucu.ingresponsable as ingresponsable, mant.fechaestimada as festimada, mant.fecharealizada as frealizada, mant.descripcion as descripcion FROM sucursales sucu INNER JOIN mantenimiento mant ON sucu.economico = mant.economico WHERE sucu.economico != 000000 ORDER BY sucu.canal ASC, sucu.nombre ASC, mant.fechaestimada DESC ');
    return result.recordset;
};

export const postMantenimientos = async (festimada, economico) => {
    const request = new sql.Request();
    request.input('fechaestimada', sql.Date, festimada);
    request.input('economico', sql.VarChar, economico);
    const query = 'INSERT INTO mantenimiento(fechaestimada, economico) VALUES (@fechaestimada, @economico)';

    await request.query(query);
};

export const deleteMantenimiento = async (id) => {
    const request = new sql.Request();
    request.input('id', sql.Numeric, id);
    const query = 'DELETE FROM mantenimiento WHERE id = @id';

    await request.query(query);
};

/* Validaciones */
/* Comprobar que existe la sucursal antes de cualquier operación con los dispositivos */
async function SucursalExiste(economico) {
    try {
        const query = 'SELECT economico FROM sucursales WHERE economico = @economico';
        const request = new sql.Request();
        request.input('economico', sql.VarChar, economico);
        const resultado = await request.query(query);
        return resultado.recordset.length > 0;  // La sucursal existe
    } catch (error) {
        console.error('Error al comprobar la sucursal:', error);
        throw error;
    }
};

/* Comprobar que fecha estimada es mayor a 01/Enero/2024 */
async function comprobarFechaEstimada(festimada) {
    try {        
        return '2024-01-01' < festimada;
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
};

/* Comprobar que ID del dispositivo existe para corrobar ejecución */
async function comprobarID(id) {
    try {
        const query = 'SELECT id FROM mantenimiento WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        return resultado.recordset.length > 0; // El ID exite
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
};

export {
    SucursalExiste, comprobarFechaEstimada, comprobarID
};