/* MODEL DE LA INFORMACIÓN DE LAS SUCURSALES */
import sql from 'mssql';
export const obtenerSucursales = async (responsable, tipo) => {
  const request = new sql.Request();

  if (responsable === 'Aplicativo') {
    return await request.query(`
        SELECT economico, canal, nombre, ingresponsable 
        FROM sucursales 
        WHERE economico != 000000 
        ORDER BY canal ASC, nombre ASC 
  `)
  } else {
    request.input('responsable', sql.VarChar, responsable);
    return await request.query(`
      SELECT economico, canal, nombre 
      FROM sucursales 
      WHERE ingresponsable = @responsable 
      ORDER BY canal ASC, nombre ASC 
      `)
  }
};