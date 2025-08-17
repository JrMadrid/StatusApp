/* MODEL DE INFORMATIVA -- MANTENIMIENTO */
import sql from 'mssql';

// Mandar el documento del mantemiento seleccionado
export const fechaSeleccionada = async (id) => {
  const request = new sql.Request();
  request.input('id', sql.Int, id);
  const result = await request.query(`SELECT constancia FROM mantenimiento WHERE id = @id`);
  return result.recordset[0];
};

// Mandar las fechas vinculadas al economico
export const fechasRealizadas = async (economico) => {
  const request = new sql.Request();
  request.input('economico', sql.VarChar, economico)
  const result = await request.query(`SELECT mante.id as id, mante.fecharealizada AS realizado, mante.economico AS economico, sucu.nombre AS sucursal, sucu.ingresponsable as ingresponsable FROM mantenimiento mante INNER JOIN sucursales sucu ON mante.economico = sucu.economico WHERE mante.economico = @economico ORDER BY mante.fecharealizada DESC`);
  return result.recordset;
};

// Mandar el archivo de la constancia de la fecha seleccionada
export const getMantenimientoArchivo = async (fechasr, economico) => {
  const request = new sql.Request();
  request.input('fechasr', sql.Date, fechasr);
  request.input('economico', sql.VarChar, economico)
  const constanciaAr = await request.query(`SELECT constancia FROM mantenimiento WHERE fecharealizada = @fechasr AND economico = @economico`);
  return constanciaAr.recordset[0];
};

// Mandar todas las constancias
export const getMantenimientosArchivos = async (economico) => {
  const request = new sql.Request();
  request.input('economico', sql.VarChar, economico)
  const constanciasAr = await request.query(`SELECT constancia FROM mantenimiento WHERE economico = @economico AND constancia IS NOT NULL`);
  return constanciasAr.recordset;
};