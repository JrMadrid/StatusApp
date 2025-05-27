/* MODEL DE AUTENTICACIÓN DE USUARIOS */
// import dbConnection from '../db/connection.js';
import bcrypt from 'bcryptjs'; // Encriptar datos
import sql from 'mssql';

/* Comprobar si el usuario existe o no en la base de datos */
async function comprobarUsuario(nickname, psw) {
	try {
		// await dbConnection(); solo se inicia la conexion al arrancar el servidor;

		const query = 'SELECT nickname, psw, isAdmin, tipo FROM users WHERE nickname = @nickname';
		const request = new sql.Request();
		request.input('nickname', sql.VarChar, nickname);
		const resultado = await request.query(query);

		if (resultado.recordset.length > 0) { // Si el usuario existe (aun no validado)
			const usuario = resultado.recordset[0].nickname;
			const admon = resultado.recordset[0].isAdmin;
			const tipo = resultado.recordset[0].tipo;
			const hashAlmacenado = resultado.recordset[0].psw;

			const valid = await new Promise((resolve, reject) => {
				bcrypt.compare(psw.trim(), hashAlmacenado, (error, valid) => {
					if (error) {
						reject(error); // Rechaza la Promesa con el error
					} else {
						resolve(valid); // Resuelve la Promesa con el resultado de la comparación
					}
				});
			});

			if (valid) {
				return { usuario, admon, tipo, error: null }; // Retorna el usuario y el estado de administrador
			} else {
				return { usuario: null, admon: null, tipo: null, error: "La contraseñas es incorrecta" }; // Retorna nulos si las contraseñas no coinciden
			}
		} else {
			return { usuario: null, admon: null, tipo: null, error: "El usuario no existe" }; // No existe el usuario
		}
	} catch (error) {
		console.error('Error al comprobar usuario:', error);
		throw error; // Lanzar el error para que se maneje en el controlador
	}/*  finally { // Ya no es necesario cerrar la conexión aquí ya que destruye el pool 
        try {
            await sql.close(); // Intenta cerrar la conexión a la base de datos
        } catch (closeError) {
            console.error('Error al cerrar la conexión:', closeError);
        }
    } */
}

export { comprobarUsuario };