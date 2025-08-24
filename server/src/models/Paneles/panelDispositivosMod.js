/* MODEL PARA VALIDAR DATOS DE DISPOSITIVOS */
import sql from 'mssql';

// Pedir los datos de los dispositivos
export const getDispositivos = async () => {
	const result = await sql.query(`
            SELECT dispo.nombre AS dispositivo, dispo.ip AS ip, sucu.economico AS economico, dispo.id AS id, sucu.canal AS canal, sucu.nombre AS sucursal, sucu.ingresponsable as ingresponsable
            FROM sucursales sucu
            INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico
            ORDER BY sucu.canal, sucu.nombre
        `);
	return result.recordset;
};

// Agregar un nuevo dispositivo
export async function postDispositivo(economico, ip, nombre, descripcion, general) {
	const request = new sql.Request();
	request.input('ip', sql.VarChar, ip);
	request.input('economico', sql.VarChar, economico);
	request.input('nombre', sql.VarChar, nombre);
	request.input('descripcion', sql.VarChar, descripcion);
	request.input('general', sql.VarChar, general);
	await request.query(`
						INSERT INTO dispositivos (ip, economico, nombre, descripcion, general)
						VALUES (@ip, @economico, @nombre, @descripcion, @general)
				`);
};

// Actualizar un dispositivo
export async function updateDispositivo(economico, ip, nombre, id, descripcion, general, reiniciar) {
	const updates = [];
	const request = new sql.Request();

	if (economico?.length) {
		updates.push('economico = @economico');
		request.input('economico', sql.VarChar, economico);
	}
	if (ip?.length) {
		updates.push('ip = @ip');
		request.input('ip', sql.VarChar, ip);
	}
	if (nombre?.length) {
		updates.push('nombre = @nombre');
		request.input('nombre', sql.VarChar, nombre);
	}
	if (reiniciar === 'yes') {
		updates.push("descripcion = ''", "general = ''");
	} else {
		if (descripcion?.length) {
			updates.push('descripcion = @descripcion');
			request.input('descripcion', sql.VarChar, descripcion);
		}
		if (general?.length) {
			updates.push('general = @general');
			request.input('general', sql.VarChar, general);
		}
	}

	if (!updates.length) throw { code: 400, message: 'Sin cambios válidos' };

	const query = `UPDATE dispositivos SET ${updates.join(', ')} WHERE id = @id`;
	request.input('id', sql.Int, id);
	await request.query(query);
};

// Eliminar un dispositivo
export async function deleteDispositivo(id) {
	const transaction = new sql.Transaction();
	await transaction.begin();
	const request = new sql.Request(transaction);
	request.input('id', sql.Int, id);
	await request.query('ALTER TABLE info NOCHECK CONSTRAINT FK_info_dispositivos');
	await request.query('DELETE FROM dispositivos WHERE id = @id');
	await request.query('ALTER TABLE info CHECK CONSTRAINT FK_info_dispositivos');
	await transaction.commit();
};

/* Validaciones */
/* Comprobar que existe la sucursal antes de cualquier operación con los dispositivos */
async function SucursalExiste(economico) {
	try {
		const query = 'SELECT economico FROM sucursales WHERE economico = @economico';
		const request = new sql.Request();
		request.input('economico', sql.VarChar, economico)
		const resultado = await request.query(query);
		return resultado.recordset.length > 0; // La sucursal existe
	} catch (error) {
		console.error('Error al comprobar la sucursal:', error);
	}
};

/* Comprobar que la ip del dispositivo no esta ocupada */
async function IpOcupada(ip) {
	try {
		const query = 'SELECT ip FROM dispositivos WHERE ip = @ip';
		const request = new sql.Request();
		request.input('ip', sql.VarChar, ip)
		const resultado = await request.query(query);
		return resultado.recordset.length > 0;  // La ip esta ocupada
	} catch (error) {
		console.error('Error al comprobar la IP:', error);
	}
};

/* Comprobar que ID del dispositivo existe para corrobar ejecución */
async function comprobarID(id) {
	try {
		const query = 'SELECT id FROM dispositivos WHERE id = @id';
		const request = new sql.Request();
		request.input('id', sql.VarChar, id)
		const resultado = await request.query(query);
		return resultado.recordset.length > 0; // El ID exite
	} catch (error) {
		console.error('Error al ejecutar:', error);
	}
};

export { SucursalExiste, IpOcupada, comprobarID };