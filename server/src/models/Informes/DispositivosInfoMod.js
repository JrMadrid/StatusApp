/* MODEL DE INFORME -- DISPOSITIVOS */
import sql from 'mssql';

// Consulta los dispositivos por nombre y responsable (si aplica)
export const fetchDispositivosByNombre = async (dispositivo, responsable, tipo) => {
    const request = new sql.Request();
    request.input('dispositivo', sql.VarChar, dispositivo);
    let query;
    if (tipo === 'Geografia') {
        query = `
            SELECT dispo.nombre AS nombre, dispo.ip AS ip, sucu.nombre AS sucursal, sucu.economico AS economico
            FROM dispositivos dispo
            INNER JOIN sucursales sucu ON dispo.economico = sucu.economico
            WHERE dispo.nombre = @dispositivo AND sucu.ingresponsable = '${responsable}'
            ORDER BY sucu.canal ASC, sucu.nombre ASC
        `;
    } else {
        query = `
            SELECT dispo.nombre AS nombre, dispo.ip AS ip, sucu.nombre AS sucursal, sucu.economico AS economico
            FROM dispositivos dispo
            INNER JOIN sucursales sucu ON dispo.economico = sucu.economico
            WHERE dispo.nombre = @dispositivo
            ORDER BY sucu.canal ASC, sucu.nombre ASC
        `;
    }
    return (await request.query(query)).recordset;
};

// Consulta información detallada del dispositivo
export const fetchInfoDispositivo = async (dispositivo, responsable, tipo) => {
    let query;
    if (tipo === 'Geografia') {
        query = `
            SELECT sucu.nombre AS sucursal, sucu.economico AS economico, dispo.nombre AS nombre,
                   dispo.descripcion AS descripcion, dispo.general AS general, dispo.ip AS ip
            FROM sucursales sucu
            INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico
            WHERE dispo.nombre = '${dispositivo}' AND sucu.ingresponsable = '${responsable}'
            ORDER BY sucu.canal ASC, sucu.nombre ASC
        `;
    } else {
        query = `
            SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable AS ingresponsable,
                   dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.general AS general, dispo.ip AS ip
            FROM sucursales sucu
            INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico
            WHERE dispo.nombre = '${dispositivo}'
            ORDER BY sucu.canal ASC, sucu.nombre ASC
        `;
    }
    return (await sql.query(query)).recordset;
};