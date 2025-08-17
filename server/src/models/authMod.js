/* MODEL DE AUTENTICACIÓN DE USUARIOS */
import bcrypt from 'bcryptjs'; // Encriptar datos
import sql from 'mssql';

/* Comprobar si el usuario existe o no en la base de datos */
async function comprobarUsuario(nickname, psw) {
	try {
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
			// const inicio = true // Saltar validación
			// if (inicio) { // Saltar validación
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
	}
};

/* Validaciones */
// Comprobar que el usuario esta activo
const comprobarActivo = async (nickname) => {
	try {
		const query = `SELECT activo FROM personal WHERE nickname = @nickname`;
		const request = new sql.Request();
		request.input('nickname', sql.VarChar, nickname);
		const resultado = await request.query(query);
		return resultado.recordset[0].activo;
	} catch (error) {
		console.error('Error al comprobar si es valido:', error);
	}
};

export { comprobarUsuario, comprobarActivo };