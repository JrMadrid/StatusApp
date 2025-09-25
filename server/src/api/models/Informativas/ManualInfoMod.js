/* MODEL DE INFORMATIVA -- MANUAL */
import sql from 'mssql';

// Mandar los datos del manual
export const getDatosManual = async (manualid) => {
  const request = new sql.Request();
  request.input('manualid', sql.Int, manualid);
  const result = await request.query('SELECT nombre, descripcion FROM manuales WHERE id = @manualid');
  return result.recordset[0];
};

// Mandar el manual
export const getManualArchivo = async (manualid) => {
  const request = new sql.Request();
  request.input('manualid', sql.Int, manualid);
  const result = await request.query('SELECT manual FROM manuales WHERE id = @manualid');
  return result.recordset[0];
};