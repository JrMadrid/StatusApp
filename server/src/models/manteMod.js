/* MODEL PARA VALIDAR DATOS DE MANTENIMIENTOS */
import dbConnection from "../db/connection.js";
import sql from 'mssql';

/* Comprobar que existe la sucursal antes de cualquier operación con los dispositivos */
async function SucursalExiste(economico) {
    try {
        await dbConnection();
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
        await dbConnection()
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

/* Comprobar que fecha realizada es mayor que fecha estimada */
async function comprobarFechaRealizada(frealizada, id) {
    try {
        await dbConnection();
        const festimada = 'SELECT fechaestimada FROM mantenimiento WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.Numeric, id);
        const response = await request.query(festimada); // Ejecutar la consulta   
        let fechaestimada = response.recordset[0].fechaestimada
        let fechaestimadacons = fechaestimada.toISOString();
        fechaestimadacons = fechaestimadacons.split('T')[0]; // "2024-01-17"        
        return fechaestimadacons < frealizada;
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

/* Comprobar que fecha realizada es mayor que fecha estimada */
async function ConstanciaExiste(id) {
    try {
        await dbConnection();
        const query = 'SELECT constancia FROM mantenimiento WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        return resultado.recordset[0].constancia !== null;// Ya tiene mantenimiento
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

/* Comprobar que ID del dispositivo existe para corrobar ejecución */
async function comprobarSuMantenimiento(id, responsable) {
    try {
        await dbConnection();
        const query = 'SELECT sucu.ingresponsable as ingeniero FROM mantenimiento mante INNER JOIN sucursales sucu ON sucu.economico = mante.economico WHERE mante.id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);
        const ingeniero = resultado.recordset[0].ingeniero;

        return responsable.toLowerCase() === ingeniero.toLowerCase(); // Si es su mantenimiento
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

/* Saber el economico */
async function ecoSucursal(id) {
    try {
        await dbConnection();
        const query = 'SELECT economico FROM mantenimiento WHERE id = @id';
        const request = new sql.Request();
        request.input('id', sql.VarChar, id)
        const resultado = await request.query(query);

        return resultado.recordset[0].economico;
    } catch (error) {
        console.error('Error al ejecutar:', error);
        throw error;
    }
}

/* Siguiente estimado */
async function nextFEstimada(frealizado) {
    let siguiFEstimada = '';
    let [yy, mm, dd] = frealizado.split('-');
    yy = parseInt(yy);
    mm = parseInt(mm);
    let siguiY = yy;
    if (6 < mm) {
        // console.log('segundo semestre, le toca el primer semestre del otro año');
        siguiY = siguiY + 1;
        siguiFEstimada = `${siguiY}-01-01`;
    } else {
        // console.log('primer semestre, le toca el segundo semestre del mismo otro año');
        siguiFEstimada = `${yy}-07-01`;
    }
    return siguiFEstimada;
}

export {
    SucursalExiste, comprobarFechaEstimada,
    comprobarID, comprobarFechaRealizada, ConstanciaExiste, comprobarSuMantenimiento, ecoSucursal, nextFEstimada
};