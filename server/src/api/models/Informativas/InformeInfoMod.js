/* MODEL DE INFORMATIVA -- INFORMES */
import sql from 'mssql';

// Mandar los datos del informe
export const getInformeNombreDescripcion = async (id) => {
  const request = new sql.Request();
  const result = await request.query(`SELECT nombre, descripcion FROM informes WHERE id = ${id}`);
  return result.recordset;
};

// Mandar el informe
export const getInformeArchivo = async (id) => {
  const result = await sql.query(`SELECT informe FROM informes WHERE id = ${id}`);
  return result.recordset[0];
};