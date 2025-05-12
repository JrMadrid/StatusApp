/* MODEL PARA VALIDAR DATOS DE MANUALES */
import sql from 'mssql';

// Pedimos los datos de los manuales
export const getManuales = async () => {
	const request = new sql.Request();
	let result = await request.query(`SELECT id, nombre, descripcion FROM manuales`);

	return result.recordset;
};

// Agregamos un nuevo manual
export const postManuales = async (descripcion, nombre, documento, manual) => {
	const request = new sql.Request();
	request.input('manual', sql.VarBinary(sql.MAX), manual); // sql.VarBinary(sql.MAX) para el tamaño máximo de VARBINARY -- varbinary(max) sirve para almacenar archivos grandes
	if (nombre.length === 0) {
		request.input('nombre', sql.VarChar, documento.toString());
	} else {
		request.input('nombre', sql.VarChar, nombre);
	}
	request.input('descripcion', sql.VarChar, descripcion);
	const query = 'INSERT INTO manuales(nombre, descripcion, manual) VALUES (@nombre, @descripcion, CONVERT(VARBINARY(MAX), @manual))';

	await request.query(query);
};

// Eliminamos un manual
export const deleteManual = async (id) => {
	const request = new sql.Request();
	request.input('id', sql.Numeric, id);
	const query = 'DELETE FROM manuales WHERE id = @id';
	await request.query(query);
};

// Actualizamos un manual
export const updateManual = async (nombre, descripcion, id) => {
	const request = new sql.Request();
	request.input('nombre', sql.VarChar, nombre);
	request.input('descripcion', sql.VarChar, descripcion);
	request.input('id', sql.Numeric, id);
	const updates = [];

	if (nombre.length !== 0) {
		updates.push('nombre = @nombre');
	}
	if (descripcion.length !== 0) {
		updates.push('descripcion = @descripcion');
	}
	if (updates.length === 0) {
		throw { status: 404, message: 'No hay datos para actualizar' };
	}
	const query = `UPDATE manuales SET ${updates.join(', ')} WHERE id = @id`;

	await request.query(query);
};

// Pedimos el manual en formato PDF
export const Manual = async (id) => {
	const request = new sql.Request();
	request.input('id', sql.VarChar, id);
	const query = 'SELECT manual FROM manuales WHERE id = @id';
	const resultado = await request.query(query);
	return resultado.recordset;
};

/* Validaciones */
/* Comprobar que ID del manual existe para corrobar ejecución */
async function comprobarID(id) {
	try {
		const query = 'SELECT id FROM manuales WHERE id = @id';
		const request = new sql.Request();
		request.input('id', sql.VarChar, id);
		const resultado = await request.query(query);
		return resultado.recordset.length > 0;
	} catch (error) {
		console.error('Error al comprobar el ID:', error);
		throw error;
	}
}

export { comprobarID };