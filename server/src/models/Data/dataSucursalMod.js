/* MODEL DE LA INFORMACIÓN DE LAS SUCURSALES */
import sql from 'mssql';
export const obtenerSucursales = async (responsable, tipo) => {
  const request = new sql.Request();
  let query;
  if (tipo === 'Aplicativo') {
    query = `
        SELECT economico, canal, nombre, ingresponsable 
        FROM sucursales 
        WHERE economico != 000000 
        ORDER BY canal ASC, nombre ASC 
  `;
  } else {
    request.input('responsable', sql.VarChar, responsable);
    query= `
      SELECT economico, canal, nombre 
      FROM sucursales 
      WHERE ingresponsable = @responsable 
      ORDER BY canal ASC, nombre ASC 
      `;
  }
  return (await request.query(query)).recordset;
};