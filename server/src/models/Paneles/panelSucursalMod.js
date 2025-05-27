/* MODEL PARA VALIDAR DATOS DE SUCURSALES */
import sql from 'mssql';

// Pedimos los datos de las sucursales
export const getSucursales = async () => {
	const request = new sql.Request()
	const result = await request.query('SELECT id, economico, canal, nombre, ingresponsable FROM sucursales WHERE economico != 000000 ORDER BY canal ASC, nombre ASC');
	return result.recordset;
};

// Agregamos una nueva sucursal
export const postSucursal = async (economico, canal, nombre, ingresponsable, rellenar) => {
	function obtenerNumeroAleatorio() {
		return Math.floor(Math.random() * 250) + 1;
	}
	const request = new sql.Request();
	let dispos;

	request.input('economico', sql.VarChar, economico);
	request.input('canal', sql.VarChar, canal);
	request.input('nombre', sql.VarChar, nombre);
	request.input('ingresponsable', sql.VarChar, ingresponsable);

	const query = 'INSERT INTO sucursales (economico, canal, nombre, ingresponsable) VALUES (@economico, @canal, @nombre, @ingresponsable)';
	await request.query(query);

	if (rellenar === 'yes') {
		dispos = (await sql.query(`SELECT dispo.nombre from dispositivos dispo INNER JOIN sucursales sucu ON sucu.economico = dispo.economico GROUP BY dispo.nombre`)).recordset;
		for (let i = 0; i < dispos.length; i++) {
			let ip = `000.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}`
			await request.query(`INSERT INTO dispositivos ([ip],[economico],[nombre]) VALUES ('${ip}','${economico}','${dispos[i].nombre}')`)
		}
	};
};

// Actualizamos una sucursal
export const updateSucursal = async (economico, canal, nombre, id, ingresponsable, rellenar) => {
	function obtenerNumeroAleatorio() {
		return Math.floor(Math.random() * 250) + 1;
	}
	let transaction;
	try {

		let economicoRellenar = '';
		if (rellenar === 'yes') { // Si quiere rellenar
			if (economico.length !== 0) { // Cambiar el economico ya que serian diferentes
				economicoRellenar = economico
			}
			else { // No cambiar el economico ya que serian diferentes
				economicoRellenar = (await sql.query(`SELECT economico from sucursales WHERE id = '${id}'`)).recordset[0].economico; // Para identificar a que economico se le va a rellenar los dispositivos
			}
		}

		const updates = [];
		if (economico.length !== 0) {
			updates.push('economico = @economico');
		}
		if (canal.length !== 0) {
			updates.push('canal = @canal');
		}
		if (nombre.length !== 0) {
			updates.push('nombre = @nombre');
		}
		if (ingresponsable.length !== 0) {
			updates.push('ingresponsable = @ingresponsable');
		}
		if (updates.length === 0 && rellenar !== 'yes') { // No hay cambios ni quiere rellenar
			throw { status: 400, message: 'No hay datos para actualizar' };
		}

		const numeroE = await Neconomico(id);

		transaction = new sql.Transaction();
		await transaction.begin();

		const request = new sql.Request(transaction);

		let query = '';
		if (updates.length !== 0) { // Si hay cambios
			query = `UPDATE sucursales SET ${updates.join(', ')} WHERE economico = '${numeroE}'`;
		}

		request.input('economico', sql.VarChar, economico);
		request.input('canal', sql.VarChar, canal);
		request.input('nombre', sql.VarChar, nombre);
		request.input('ingresponsable', sql.VarChar, ingresponsable);

		if (economico.length === 0) {
			await request.query(query);
		}
		if (economico.length !== 0) { // Si actualiza el economico debe cambiar en todas las tablas
			await request.query('ALTER TABLE dispositivos NOCHECK CONSTRAINT fk_economico');
			await request.query('ALTER TABLE mantenimiento NOCHECK CONSTRAINT FK_mantenimiento_sucursales');
			await request.query('ALTER TABLE informes NOCHECK CONSTRAINT FK_informes_sucursales');
			await request.query(query);
			await request.query(`UPDATE dispositivos SET economico = '${economico}' FROM dispositivos WHERE economico = '${numeroE}'`);
			await request.query(`UPDATE mantenimiento SET economico = '${economico}' FROM mantenimiento WHERE economico = '${numeroE}'`);
			await request.query(`UPDATE informes SET economico = '${economico}' FROM informes WHERE economico = '${numeroE}'`);
			await request.query('ALTER TABLE informes CHECK CONSTRAINT FK_informes_sucursales');
			await request.query('ALTER TABLE mantenimiento CHECK CONSTRAINT FK_mantenimiento_sucursales');
			await request.query('ALTER TABLE dispositivos CHECK CONSTRAINT fk_economico');
		};

		await transaction.commit();

		if (rellenar === 'yes') { // Cambios o no pero quiere rellenar
			const request = new sql.Request();
			const disposTodos = (await sql.query(`SELECT dispo.nombre from dispositivos dispo INNER JOIN sucursales sucu ON sucu.economico = dispo.economico GROUP BY dispo.nombre`)).recordset; // Obtenemos todos los dispositivos de la base de datos
			const disposTiene = (await sql.query(`SELECT dispo.nombre from dispositivos dispo INNER JOIN sucursales sucu ON sucu.economico = dispo.economico WHERE sucu.economico = '${economicoRellenar}' GROUP BY dispo.nombre`)).recordset; // Obtenemos los dispositivos que tiene la sucursal

			function disposNoTiene(Todos, Tiene) { // Funcion para obtener los dispositivos que no tiene la sucursal
				return Todos.filter(obj1 =>
					!Tiene.some(obj2 => obj2.nombre === obj1.nombre)
				);
			}
			const disposFaltantes = disposNoTiene(disposTodos, disposTiene); // Obtenemos los dispositivos que no tiene la sucursal

			for (let i = 0; i < disposFaltantes.length; i++) {
				let ip = `000.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}`

				await request.query(`INSERT INTO dispositivos ([ip],[economico],[nombre]) VALUES ('${ip}','${economicoRellenar}','${disposFaltantes[i].nombre}')`)
			}
		};
	} catch (error) {
		if (transaction) {
			try {

				await transaction.rollback();
			} catch (rollbackError) {
				console.error('Error al revertir la transacción:', rollbackError);
			}
		}
		console.error('Error actualizando datos:', error);
		throw { status: 500, message: 'Error actualizando datos' };
	}
};

// Eliminamos una sucursal
export const deleteSucursal = async (id) => {
	let transaction;
	try {
		const numeroE = await Neconomico(id);

		transaction = new sql.Transaction();
		await transaction.begin();

		const request = new sql.Request(transaction);

		await request.query('ALTER TABLE dispositivos NOCHECK CONSTRAINT fk_economico');
		await request.query('ALTER TABLE mantenimiento NOCHECK CONSTRAINT FK_mantenimiento_sucursales');
		await request.query('ALTER TABLE informes NOCHECK CONSTRAINT FK_informes_sucursales');
		await request.query(`DELETE FROM sucursales WHERE economico = '${numeroE}'`); // Se elimina la sucursal
		await request.query(`DELETE FROM mantenimiento WHERE economico = '${numeroE}'`); // Se eliminan los mantenimientos de la sucursal
		await request.query(`DELETE FROM informes WHERE economico = '${numeroE}'`); // Se eliminan los informes de la sucursal
		await request.query(`DELETE FROM dispositivos WHERE economico = '${numeroE}' AND (ip LIKE '000.%' OR ip LIKE '001.%')`); // Se eliminan las ips de los dispositivos no validas de la sucursal
		await request.query(`UPDATE dispositivos SET economico = '000000' FROM dispositivos WHERE economico = ${numeroE} AND (ip NOT LIKE '000.%' OR ip NOT LIKE '001.%')`); // Sus dispositivos pasan a sucursal especial "Sin establecer"
		await request.query('ALTER TABLE informes CHECK CONSTRAINT FK_informes_sucursales');
		await request.query('ALTER TABLE mantenimiento CHECK CONSTRAINT FK_mantenimiento_sucursales');
		await request.query('ALTER TABLE dispositivos CHECK CONSTRAINT fk_economico');

		await transaction.commit();
	} catch (error) {
		if (transaction) {
			try {
				await transaction.rollback();
			} catch (rollbackError) {
				console.error('Error al revertir la transacción:', rollbackError);
			}
		}
	}
}

/* Validaciones */
/* Comprobar que el economico no esta ocupado */
async function EconomicoOcupado(economico) {
	try {
		// await dbConnection(); solo se inicia la conexion al arrancar el servidor;
		const query = 'SELECT economico FROM sucursales WHERE economico = @economico';
		const request = new sql.Request();
		request.input('economico', sql.VarChar, economico);
		const resultado = await request.query(query);
		return resultado.recordset.length > 0;
	} catch (error) {
		console.error('Error al comprobar el economico: ', error);
		throw error;
	}
}

/* Comprobar que ID de la sucursal existe para corrobar ejecución */
async function comprobarID(id) {
	try {
		// await dbConnection(); solo se inicia la conexion al arrancar el servidor;
		const query = 'SELECT id FROM sucursales WHERE id = @id';
		const request = new sql.Request();
		request.input('id', sql.VarChar, id)
		const resultado = await request.query(query);
		return resultado.recordset.length > 0;
	} catch (error) {
		console.error('Error al ejecutar: ', error);
		throw error;
	}
}

/* Conseguir el economico para transacción */
async function Neconomico(id) {
	try {
		// await dbConnection(); solo se inicia la conexion al arrancar el servidor
		const query = 'SELECT economico FROM sucursales WHERE id = @id'
		const request = new sql.Request();
		request.input('id', sql.VarChar, id)
		const resultado = await request.query(query);
		return resultado.recordset[0].economico;
	} catch (error) {
		console.error('Error al conseguir el economico: ', error);
		throw error;
	}
}

/* Comprobar que existe el ingresponsable */
async function IngResponsable(ingresponsable) {
	try {
		// await dbConnection(); solo se inicia la conexion al arrancar el servidor
		const query = 'SELECT nickname FROM users WHERE nickname = @ingresponsable'
		const request = new sql.Request();
		request.input('ingresponsable', sql.VarChar, ingresponsable)
		const resultado = await request.query(query);

		return resultado.recordset.length > 0;
	} catch (error) {
		console.error('Error al conseguir el usuario: ', error);
		throw error;
	}
}

export { EconomicoOcupado, comprobarID, Neconomico, IngResponsable };