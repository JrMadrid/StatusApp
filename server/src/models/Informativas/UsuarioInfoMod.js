/* MODEL DE INFORMATIVA -- USUARIO */
import sql from 'mssql';

// Pide la lista de usuarios
export const getListaUsuarios = async () => {
  const request = new sql.Request();
  const result = await request.query(`
    SELECT u.nickname
    FROM users as u
    INNER JOIN personal p on u.nickname = p.nickname 
    ORDER BY u.id
    `);

  return result.recordset;
};

// Pide los datos del personal seleccionado
export const getDatosSeleccionado = async (seleccionado) => {
  const request = new sql.Request();
  const result = await request.query(`
    SELECT id ,nickname ,cedula ,localidad ,fecha_nacimiento ,sexo ,fecha_contratacion ,descripcion ,grado_academico ,puesto ,activo, nombre
    FROM personal
    WHERE nickname = '${seleccionado}'
    `)

  return result.recordset[0];
};

// Pide la foto del personal seleccionado
export const getFotoSeleccionado = async (seleccionado) => {
  const request = new sql.Request();
  const result = await request.query(`
    SELECT foto
    FROM personal
    WHERE nickname = '${seleccionado}'
    `)

  return result.recordset[0];
};

// Edita los datos del personal
export const editDataPersonal = async (propiedadEditar, propiedadEditada, id) => {
  const request = new sql.Request();
  const query = `
  UPDATE personal
    SET ${propiedadEditar} = '${propiedadEditada}'
    WHERE id = @id
  `
  request.input('id', sql.Numeric, id);
  await request.query(query);
};

// Edita la foto del personal
export const editFotoPersonal = async (foto, id) => {
  const request = new sql.Request();
  const query = `
    UPDATE personal
      SET foto = @foto
      WHERE id = @id
    `
  request.input('foto', sql.VarBinary(sql.MAX), foto);
  request.input('id', sql.Numeric, id);

  await request.query(query);
} 