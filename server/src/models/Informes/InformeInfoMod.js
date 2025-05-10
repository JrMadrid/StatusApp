/* MODEL DE INFORME --  INFORMES */
import sql from 'mssql';

export const getInformeNombreDescripcion = async (id) => {
    const request = new sql.Request();
    const result = await request.query(`SELECT nombre, descripcion FROM informes WHERE id = ${id}`);
    return result.recordset;
};

export const getInformeArchivo = async (id) => {
    const result = await sql.query(`SELECT informe FROM informes WHERE id = ${id}`);
    return result.recordset;
};