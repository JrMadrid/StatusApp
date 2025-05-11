/* MODEL DE INFORME -- MANUAL */
import sql from 'mssql';

export const getDatosManual = async (manualid) => {
  const request = new sql.Request();
  request.input('manualid', sql.Int, manualid);
  const result = await request.query('SELECT nombre, descripcion FROM manuales WHERE id = @manualid');
  return result.recordset;
};

export const getManualArchivo = async (manualid) => {
  const request = new sql.Request();
  request.input('manualid', sql.Int, manualid);
  const result = await request.query('SELECT manual FROM manuales WHERE id = @manualid');
  return result.recordset;
}