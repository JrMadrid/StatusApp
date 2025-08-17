/* MODEL DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import sql from 'mssql';

// Pedir los datos de los dispositivos
export const obtenerDispositivos = async (responsable, tipo) => {
  const request = new sql.Request();
  let query;
  if (tipo === 'Aplicativo') {
    query = `
          SELECT dispo.nombre AS dispositivo, dispo.ip AS ip, sucu.economico AS economico, sucu.canal AS canal, sucu.nombre AS sucursal, sucu.ingresponsable AS ingresponsable 
          FROM sucursales sucu 
          INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico 
          ORDER BY sucu.canal ASC, sucu.nombre ASC
      `;
  } else {
    query = `
          SELECT dispo.nombre AS dispositivo, dispo.ip AS ip, sucu.economico AS economico, sucu.canal AS canal, sucu.nombre AS sucursal 
          FROM sucursales sucu 
          INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico 
          WHERE sucu.ingresponsable = @responsable 
          ORDER BY sucu.canal ASC, sucu.nombre ASC
    `;
  }
  request.input('responsable', sql.VarChar, responsable);
  return (await request.query(query)).recordset;
};

// Pedir la lista de los dispositivos
export const obtenerListaDispositivos = async (responsable, tipo) => {
  const request = new sql.Request();
  let query;
  if (tipo === 'Geografia') {
    query = `
          SELECT dispo.nombre 
          FROM dispositivos dispo 
          INNER JOIN sucursales sucu ON sucu.economico = dispo.economico 
          WHERE sucu.ingresponsable = @responsable 
          GROUP BY dispo.nombre 
          ORDER BY nombre ASC
    `;
  } else {
    query = `
          SELECT dispo.nombre 
          FROM dispositivos dispo 
          INNER JOIN sucursales sucu ON sucu.economico = dispo.economico 
          GROUP BY dispo.nombre 
          ORDER BY nombre ASC
    `;
  }
  request.input('responsable', sql.VarChar, responsable);
  return (await request.query(query)).recordset;
};