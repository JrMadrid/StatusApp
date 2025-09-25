/* MODEL DE INFORMATIVA -- USUARIO */
import sql from 'mssql';

// Pedir la lista de usuarios
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

// Pedir los datos del personal seleccionado
export const getDatosSeleccionado = async (seleccionado) => {
  const request = new sql.Request();
  const result = await request.query(`
    SELECT id ,nickname ,cedula ,localidad ,fecha_nacimiento ,sexo ,fecha_contratacion ,descripcion ,grado_academico ,puesto ,activo, nombre, telefono
    FROM personal
    WHERE nickname = '${seleccionado}'
    `);
  return result.recordset[0];
};

// Pedir la foto del personal seleccionado
export const getFotoSeleccionado = async (seleccionado) => {
  const request = new sql.Request();
  const result = await request.query(`
    SELECT foto
    FROM personal
    WHERE nickname = '${seleccionado}'
    `);
  return result.recordset[0];
};

// Editar los datos del personal
export const editDataPersonal = async (propiedadEditar, propiedadEditada, id) => {
  const request = new sql.Request();
  request.input('id', sql.Numeric, id);
  await request.query(`
  UPDATE personal
  SET ${propiedadEditar} = '${propiedadEditada}'
  WHERE id = @id
  `);
};

// Editar la foto del personal
export const editFotoPersonal = async (foto, id) => {
  const request = new sql.Request();
  request.input('foto', sql.VarBinary(sql.MAX), foto);
  request.input('id', sql.Numeric, id);
  await request.query(`
    UPDATE personal
    SET foto = @foto
    WHERE id = @id
    `);
};

/* Validaciones */
/* Verificar que no se desactive al SuperAdministrador */
export const desactivarSuper = async (id) => {
  return id == '1'; // ID del super administrador
};