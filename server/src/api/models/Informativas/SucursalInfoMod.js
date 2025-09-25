/* MODEL DE INFORMATIVA -- SUCURSAL */
import sql from 'mssql';

// Consultar y retornar los dispositivos registrados por número económico
export const getDatosDispositivos = async (economico) => {
  const request = new sql.Request();
  request.input('economico', sql.VarChar, economico);
  const result = await request.query(` 
          SELECT dispo.nombre AS nombre, dispo.ip AS ip, dispo.economico AS economico, 
                  sucu.nombre AS sucursal, sucu.ingresponsable as ingresponsable 
          FROM dispositivos dispo 
          INNER JOIN sucursales sucu ON dispo.economico = sucu.economico 
          WHERE dispo.economico = @economico
    `);
  return result.recordset;
};

// Obtener la información general de un dispositivo en específico por su IP
export const dispositivoIP = async (ip) => {
  const request = new sql.Request();
  request.input('ip', sql.VarChar, ip);
  const dispositivo = await request.query(`SELECT nombre FROM dispositivos WHERE ip = @ip`);
  return dispositivo.recordset[0].nombre;
};

// Consultar información general y de la sucursal del dispositivo
export const infoGeneralDispositivo = async (ip) => {
  const request = new sql.Request();
  request.input('ip', sql.VarChar, ip);
  const infoGeneral = await request.query(`
          SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable as ingresponsable, 
                  dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.ip as ip, dispo.general as general 
          FROM sucursales sucu 
          INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico 
          WHERE dispo.ip = @ip
    `);
  return infoGeneral.recordset[0]
};

// Consultar todos los dispositivos válidos de la sucursal
export const dispositivosSucursal = async (economico) => {
  const request = new sql.Request();
  request.input('economico', sql.VarChar, economico);
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

// Actualizar el campo "general" en la base de datos
export const actualizarGeneral = async (general, ip) => {
  const request = new sql.Request();
  request.input('general', sql.VarChar, general);
  request.input('ip', sql.VarChar, ip);
  await request.query(`UPDATE dispositivos SET general = @general WHERE ip = @ip`);
};

// Actualizar el campo "descripcion" en la base de datos
export const actualizarDescripcion = async (descripcion, ip) => {
  const request = new sql.Request();
  request.input('descripcion', sql.VarChar, descripcion);
  request.input('ip', sql.VarChar, ip);
  await request.query(`UPDATE dispositivos SET descripcion = @descripcion WHERE ip = @ip`);
};