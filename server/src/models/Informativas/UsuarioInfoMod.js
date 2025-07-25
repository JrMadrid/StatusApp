/* MODEL DE INFORMATIVA -- USUARIO */
import sql from 'mssql';

export const getListaUsuarios = async () => {
  const request = new sql.Request();
  const result = await request.query(`
    SELECT u.nickname
    FROM users as u
    INNER JOIN usuarios e on u.codigo = e.codigo
    `);

  return result.recordset;
};