/* MODEL PARA VALIDAR DATOS DE DISPOSITIVOS */
import sql from 'mssql';

export const getDispositivos = async () => {
	const query = `
            SELECT 
                dispo.nombre AS dispositivo,
                dispo.ip AS ip,
                sucu.economico AS economico,
                sucu.canal AS canal,
                sucu.nombre AS sucursal,
                sucu.ingresponsable as ingresponsable,
                dispo.id AS id
            FROM sucursales sucu
            INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico
            ORDER BY sucu.canal, sucu.nombre
        `;
	const result = await sql.query(query);
	return result.recordset;
};

/* Agregar un nuevo dispositivo con validaciones */
export async function postDispositivo({ economico, ip, nombre, descripcion, general }) {
	const query = `
				INSERT INTO dispositivos (ip, economico, nombre, descripcion, general)
				VALUES (@ip, @economico, @nombre, @descripcion, @general)
		`;
	const request = new sql.Request();
	request.input('ip', sql.VarChar, ip);
	request.input('economico', sql.VarChar, economico);
	request.input('nombre', sql.VarChar, nombre);
	request.input('descripcion', sql.VarChar, descripcion);
	request.input('general', sql.VarChar, general);
	await request.query(query);
};

/* Actualizar un dispositivo existente */
export async function updateDispositivo(data) {
	const { economico, ip, nombre, id, descripcion, general, reiniciar } = data;

	const updates = [];
	const request = new sql.Request();

	if (economico?.length) {
		if (!(await SucursalExiste(economico))) throw { code: 404, message: 'Sucursal no válida' };
		updates.push('economico = @economico');
		request.input('economico', sql.VarChar, economico);
	}
	if (ip?.length) {
		if (await IpOcupada(ip)) throw { code: 409, message: 'IP ocupada' };
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

/* Eliminar un dispositivo con seguridad */
export async function deleteDispositivo(id) {

	const transaction = new sql.Transaction();
	await transaction.begin();

	const request = new sql.Request(transaction);
	await request.query('ALTER TABLE info NOCHECK CONSTRAINT FK_info_dispositivos');
	request.input('id', sql.Int, id);
	await request.query('DELETE FROM dispositivos WHERE id = @id');
	await request.query('ALTER TABLE info CHECK CONSTRAINT FK_info_dispositivos');

	await transaction.commit();
};

/* Validaciones */
/* Comprobar que existe la sucursal antes de cualquier operación con los dispositivos */
async function SucursalExiste(economico) {
	try {
		// await dbConnection(); solo se inicia la conexion al arrancar el servidor;
		const query = 'SELECT economico FROM sucursales WHERE economico = @economico';
		const request = new sql.Request();
		request.input('economico', sql.VarChar, economico)
		const resultado = await request.query(query);
		return resultado.recordset.length > 0; // La sucursal existe
	} catch (error) {
		console.error('Error al comprobar la sucursal:', error);
		throw error;
	}
};

/* Comprobar que la ip del dispositivo no esta ocupada */
async function IpOcupada(ip) {
	try {
		// await dbConnection(); solo se inicia la conexion al arrancar el servidor
		const query = 'SELECT ip FROM dispositivos WHERE ip = @ip';
		const request = new sql.Request();
		request.input('ip', sql.VarChar, ip)
		const resultado = await request.query(query);
		return resultado.recordset.length > 0;  // La ip esta ocupada
	} catch (error) {
		console.error('Error al comprobar la IP:', error);
		throw error;
	}
};

/* Comprobar que ID del dispositivo existe para corrobar ejecución */
async function comprobarID(id) {
	try {
		// await dbConnection(); solo se inicia la conexion al arrancar el servidor
		const query = 'SELECT id FROM dispositivos WHERE id = @id';
		const request = new sql.Request();
		request.input('id', sql.VarChar, id)
		const resultado = await request.query(query);
		return resultado.recordset.length > 0; // El ID exite
	} catch (error) {
		console.error('Error al ejecutar:', error);
		throw error;
	}
};

export { SucursalExiste, IpOcupada, comprobarID };