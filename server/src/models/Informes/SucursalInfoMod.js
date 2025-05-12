/* MODEL DE INFORME -- SUCURSAL */
import sql from 'mssql'

export const getDatosAplicaciones = async (economico) => {
  const request = new sql.Request();
  request.input('economico', sql.VarChar, economico); // Inyecta el valor a la consulta
  // Consulta los dispositivos asociados al número económico
  const result = await request.query(` 
    SELECT dispo.nombre AS nombre, dispo.ip AS ip, dispo.economico AS economico, 
      sucu.nombre AS sucursal, sucu.ingresponsable as ingresponsable 
      FROM dispositivos dispo 
      INNER JOIN sucursales sucu ON dispo.economico = sucu.economico 
      WHERE dispo.economico = @economico
      `);
  return result.recordset;
};

export const dispositivoIP = async (ip) => {
  const request = new sql.Request();
  request.input('ip', sql.VarChar, ip); // Inyecta el valor a la consulta
  const dispositivo = await request.query(`SELECT nombre FROM dispositivos WHERE ip = @ip`);
  return dispositivo.recordset[0].nombre;
};

export const infoGeneralDispositivo = async (ip) => {
  const request = new sql.Request();
  request.input('ip', sql.VarChar, ip); // Inyecta el valor a la consulta
  const infoGeneral = await request.query(`
    SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable as ingresponsable, 
    dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.ip as ip, dispo.general as general 
    FROM sucursales sucu 
    INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico 
      WHERE dispo.ip = @ip
      `);
  return infoGeneral.recordset[0]
};

export const dispositivosSucursal = async (economico) => {
  const request = new sql.Request();
  request.input('economico', sql.VarChar, economico); // Inyecta el valor a la consulta
  const dbInfo = await request.query(`
          SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable as ingresponsable, 
                  dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.ip AS ip, dispo.general as general 
                  FROM sucursales sucu 
          INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico 
          WHERE sucu.economico = @economico 
          AND dispo.ip NOT LIKE '000.%' 
          AND dispo.ip NOT LIKE '001.%'
      `);
  return dbInfo.recordset;
};

export const actualizarGeneral = async (general, ip) => {
  const request = new sql.Request();
  request.input('general', sql.VarChar, general); // Inyecta el valor a la consulta
  request.input('ip', sql.VarChar, ip); // Inyecta el valor a la consulta
  await request.query(`UPDATE dispositivos SET general = @general WHERE ip = @ip`);
};

export const actualizarDescripcion = async (descripcion, ip) => {
  const request = new sql.Request();
  request.input('descripcion', sql.VarChar, descripcion); // Inyecta el valor a la consulta
  request.input('ip', sql.VarChar, ip); // Inyecta el valor a la consulta
  await request.query(`UPDATE dispositivos SET descripcion = @descripcion WHERE ip = @ip`);
};