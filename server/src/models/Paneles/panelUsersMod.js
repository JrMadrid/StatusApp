/* MODEL PARA VALIDAR DATOS DE USUARIOS */
import sql from 'mssql';

export const getUsers = async () => {
  const request = new sql.Request();
  let result = await request.query('SELECT id, nickname, psw, tipo FROM users');
  
  return result.recordset;
};

// Agregamos un nuevo usuario
export const postUser = async (nickname, psw, tipo, isAdmin) => {
  const request = new sql.Request();
  request.input('nickname', sql.VarChar, nickname);
  request.input('psw', sql.VarChar, psw);
  request.input('isAdmin', sql.Bit, isAdmin);
  request.input('tipo', sql.VarChar, tipo);
  const query = 'INSERT INTO users (nickname, psw, isAdmin, tipo) VALUES (@nickname, @psw, @isAdmin, @tipo)';

  await request.query(query);
};

// Actualizamos un usuario
export const updateUser = async (nickname, psw, id, tipo) => {
  let transaction;
  let isAdmin;

  psw = psw.trim();
  const Admin = await IDdelAdmin(id)
  const updates = [];

  let nick;
  if (nickname.length !== 0) {
    const EsNicknameOcupado = await NicknameOcupado(nickname);
    if (EsNicknameOcupado) {
      throw { status: 409, message: 'El Nickname definido ya existe en la base de datos. ' };

    } else {
      updates.push('nickname = @nickname');
      if (nickname.length !== 0) {
        const idrequest = new sql.Request();
        nick = (await idrequest.query(`select nickname from users where id = ${id}`)).recordset[0].nickname;
      }
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
      if (tipo === 'Administrador') {
        isAdmin = 1;
      }
      else {
        isAdmin = 0;
      }
    }

    updates.push('tipo = @tipo')
    updates.push('isAdmin = @isAdmin')
  }
  if (updates.length === 0) {
    throw { status: 400, message: 'No hay datos para actualizar' };
  }

  transaction = new sql.Transaction();
  await transaction.begin();
  const request = new sql.Request(transaction);

  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = @id`;
  request.input('nickname', sql.VarChar, nickname);
  request.input('psw', sql.VarChar, psw);
  request.input('id', sql.Numeric, id);
  request.input('isAdmin', sql.Bit, isAdmin);
  request.input('tipo', sql.VarChar, tipo);

  await request.query('ALTER TABLE sucursales NOCHECK CONSTRAINT FK_ingresponsable');

  await request.query(query);
  if (nickname.length !== 0) {
    await request.query(`UPDATE sucursales SET ingresponsable = @nickname FROM sucursales WHERE ingresponsable = '${nick}'`);
  };

  await request.query('ALTER TABLE sucursales CHECK CONSTRAINT FK_ingresponsable');

  await transaction.commit();
};

// Eliminamos un usuario
export const deleteUser = async (id, ingResponsable) => {
  let transaction;

  transaction = new sql.Transaction();
  await transaction.begin();
  const request = new sql.Request(transaction);

  request.input('id', sql.Numeric, id);
  const query = 'DELETE FROM users WHERE id = @id';

  request.input('ingResponsable', sql.VarChar, ingResponsable);

  await request.query('ALTER TABLE sucursales NOCHECK CONSTRAINT FK_ingresponsable');

  await request.query(`UPDATE sucursales SET ingresponsable = 'Joel Herrera' FROM sucursales WHERE ingresponsable = @ingResponsable`);
  await request.query(query);

  await request.query('ALTER TABLE sucursales CHECK CONSTRAINT FK_ingresponsable');

  await transaction.commit();
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