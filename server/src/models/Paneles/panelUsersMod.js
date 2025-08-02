/* MODEL PARA VALIDAR DATOS DE USUARIOS */
import sql from 'mssql';

export const getUsers = async () => {
  const request = new sql.Request();
  let result = await request.query('SELECT id, nickname, psw, tipo FROM users');

  return result.recordset;
};

// Agregamos un nuevo usuario
export const postUser = async (nickname, psw, tipo, isAdmin) => {
  let transactionCrearPersonal;
  transactionCrearPersonal = new sql.Transaction();
  const requestCrear = new sql.Request(transactionCrearPersonal);

  await transactionCrearPersonal.begin();
  const query = 'INSERT INTO users (nickname, psw, isAdmin, tipo) VALUES (@nickname, @psw, @isAdmin, @tipo)';
  requestCrear.input('nickname', sql.VarChar, nickname);
  requestCrear.input('psw', sql.VarChar, psw);
  requestCrear.input('isAdmin', sql.Bit, isAdmin);
  requestCrear.input('tipo', sql.VarChar, tipo);

  await requestCrear.query(query);
  await requestCrear.query(`INSERT INTO personal (nickname) VALUES ('${nickname}')`);

  await transactionCrearPersonal.commit();
};

// Actualizamos un usuario
export const updateUser = async (nickname, psw, id, tipo) => {
  let transactionPersonalyingResponsable;
  let isAdmin;

  psw = psw.trim();
  const Admin = await IDdelAdmin(id)
  const updates = [];

  // Si se ha modificado el nickname (apodo) se debe recuperar el anterior para la consulta.
  let nick;
  if (nickname.length !== 0) {
    updates.push('nickname = @nickname');
    if (nickname.length !== 0) {
      const idrequest = new sql.Request();
      nick = (await idrequest.query(`select nickname from users where id = ${id}`)).recordset[0].nickname;
    }
  }

  if (psw.length !== 0) {
    updates.push('psw = @psw');
  }

  if (tipo.length !== 0) {
    if (Admin) {
      throw { status: 403, message: 'No se puede modificar super administrador' };
    }
    else {
      tipo === 'Administrador' ? isAdmin = 1 : isAdmin = 0;
    }

    updates.push('tipo = @tipo')
    updates.push('isAdmin = @isAdmin')
  }
  if (updates.length === 0) {
    throw { status: 400, message: 'No hay datos para actualizar' };
  }

  transactionPersonalyingResponsable = new sql.Transaction();
  await transactionPersonalyingResponsable.begin();
  const requestActualizar = new sql.Request(transactionPersonalyingResponsable);

  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = @id`;
  requestActualizar.input('nickname', sql.VarChar, nickname);
  requestActualizar.input('psw', sql.VarChar, psw);
  requestActualizar.input('id', sql.Numeric, id);
  requestActualizar.input('isAdmin', sql.Bit, isAdmin);
  requestActualizar.input('tipo', sql.VarChar, tipo);

  await requestActualizar.query('ALTER TABLE sucursales NOCHECK CONSTRAINT FK_ingresponsable');
  await requestActualizar.query('ALTER TABLE personal NOCHECK CONSTRAINT FK_PersonalDetalles_Usuarios');

  await requestActualizar.query(query);
  if (nickname.length !== 0) {
    await requestActualizar.query(`UPDATE sucursales SET ingresponsable = @nickname FROM sucursales WHERE ingresponsable = '${nick}'`);
    await requestActualizar.query(`UPDATE personal SET nickname = @nickname FROM personal WHERE nickname = '${nick}'`);
  };

  await requestActualizar.query('ALTER TABLE personal CHECK CONSTRAINT FK_PersonalDetalles_Usuarios');
  await requestActualizar.query('ALTER TABLE sucursales CHECK CONSTRAINT FK_ingresponsable');

  await transactionPersonalyingResponsable.commit();
};

// Eliminamos un usuario
export const deleteUser = async (id, ingResponsable, Super) => {
  let transactionPersonalyingResponsable;

  transactionPersonalyingResponsable = new sql.Transaction();
  await transactionPersonalyingResponsable.begin();
  const requestEliminar = new sql.Request(transactionPersonalyingResponsable);

  requestEliminar.input('id', sql.Numeric, id);
  const query = 'DELETE FROM users WHERE id = @id';

  requestEliminar.input('ingResponsable', sql.VarChar, ingResponsable);

  await requestEliminar.query('ALTER TABLE sucursales NOCHECK CONSTRAINT FK_ingresponsable');
  await requestEliminar.query('ALTER TABLE personal NOCHECK CONSTRAINT FK_PersonalDetalles_Usuarios');

  await requestEliminar.query(`UPDATE sucursales SET ingresponsable = '${Super}' FROM sucursales WHERE ingresponsable = @ingResponsable`);
  await requestEliminar.query(`DELETE FROM personal WHERE nickname = @ingResponsable`);
  await requestEliminar.query(query);

  await requestEliminar.query('ALTER TABLE personal CHECK CONSTRAINT FK_PersonalDetalles_Usuarios');
  await requestEliminar.query('ALTER TABLE sucursales CHECK CONSTRAINT FK_ingresponsable');

  await transactionPersonalyingResponsable.commit();
};

// Cerramos la sesión de todos los usuarios
export const logoutaAllUsers = async () => {
  await sql.query('DELETE FROM Sessions');
};

/* Validaciones */
/* Evitar modificación del administrador */
async function IDdelAdmin(id) {
  return id === '1'; // ID del super admin
};

/* Comprobar que el nickname no está ocupado */
async function NicknameOcupado(nickname) {
  try {
    // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
    const query = 'SELECT nickname FROM users WHERE nickname = @nickname';
    const request = new sql.Request();
    request.input('nickname', sql.VarChar, nickname);
    const resultado = await request.query(query);
    return resultado.recordset.length > 0; // Devuelve `true` si el nickname existe, `false` si no
  } catch (error) {
    console.error('Error al comprobar el nickname:', error);
    throw error; // Re-lanza el error para ser manejado por el consumidor
  }
};

/* Comprobar que ID del usuario existe para corrobar ejecución */
async function comprobarID(id) {
  try {
    // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
    const query = 'SELECT id FROM users WHERE id = @id';
    const request = new sql.Request();
    request.input('id', sql.VarChar, id);
    const resultado = await request.query(query);
    return resultado.recordset.length > 0; // Devuelve `true` si el ID existe, `false` si no
  } catch (error) {
    console.error('Error al comprobar el ID:', error);
    throw error; // Re-lanza el error para ser manejado por el consumidor
  }
}

/* Conocer el nombre del ing. Responsable por su id*/
async function nombreResponsable(id) {
  try {
    // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
    const query = 'SELECT nickname FROM users WHERE id = @id';
    const request = new sql.Request();
    request.input('id', sql.VarChar, id);
    const resultado = await request.query(query);
    return resultado.recordset[0].nickname;
  } catch (error) {
    console.error('Error: ', error);
    throw error; // Re-lanza el error para ser manejado por el consumidor
  }
}

export { IDdelAdmin, NicknameOcupado, comprobarID, nombreResponsable };