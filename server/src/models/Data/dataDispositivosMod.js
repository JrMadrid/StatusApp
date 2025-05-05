/* MODEL DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import sql from 'mssql';

export const obtenerDispositivos = async (responsable, tipo) => {
  const request = new sql.Request();

  if (tipo === 'Aplicativo') {
      return await request.query(`
          SELECT dispo.nombre AS dispositivo, dispo.ip AS ip, sucu.economico AS economico, 
                 sucu.canal AS canal, sucu.nombre AS sucursal, sucu.ingresponsable AS ingresponsable 
          FROM sucursales sucu 
          INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico 
          ORDER BY sucu.canal ASC, sucu.nombre ASC
      `);
  } else {
      request.input('responsable', sql.VarChar, responsable);
      return await request.query(`
          SELECT dispo.nombre AS dispositivo, dispo.ip AS ip, sucu.economico AS economico, 
                 sucu.canal AS canal, sucu.nombre AS sucursal 
          FROM sucursales sucu 
          INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico 
          WHERE sucu.ingresponsable = @responsable 
          ORDER BY sucu.canal ASC, sucu.nombre ASC
      `);
  }
};

export const obtenerListaDispositivos = async (responsable, tipo) => {
  const request = new sql.Request();

  if (tipo === 'Geografia') {
      request.input('responsable', sql.VarChar, responsable);
      return await request.query(`
          SELECT dispo.nombre 
          FROM dispositivos dispo 
          INNER JOIN sucursales sucu ON sucu.economico = dispo.economico 
          WHERE sucu.ingresponsable = @responsable 
          GROUP BY dispo.nombre 
          ORDER BY nombre ASC
      `);
  } else {
      return await request.query(`
          SELECT dispo.nombre 
          FROM dispositivos dispo 
          INNER JOIN sucursales sucu ON sucu.economico = dispo.economico 
          GROUP BY dispo.nombre 
          ORDER BY nombre ASC
      `);
  }
};