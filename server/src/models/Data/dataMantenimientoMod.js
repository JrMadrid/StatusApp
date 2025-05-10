/* MODEL DE LA INFORMACIÓN DE LOS DISPOSITIVOS */
import sql from 'mssql';
export const obtenerMantenimientos = async (responsable, tipo) => {
	const request = new sql.Request();

	if (tipo === 'Aplicativo') {
		return await request.query(`
				SELECT mant.id as id, sucu.economico as economico, sucu.canal as canal, sucu.nombre as sucursal, sucu.ingresponsable as ingresponsable, 
								mant.fechaestimada as festimada, mant.fecharealizada as frealizada,  mant.descripcion as descripcion
				FROM sucursales sucu 
				INNER JOIN mantenimiento mant ON sucu.economico = mant.economico 
				WHERE sucu.economico != 000000 
				ORDER BY sucu.canal ASC, sucu.nombre ASC, mant.fechaestimada DESC 
      `);
	} else {
		request.input('responsable', sql.VarChar, responsable);
		return await request.query(`
				SELECT mant.id as id, sucu.economico as economico, sucu.canal as canal, sucu.nombre as sucursal, sucu.ingresponsable as ingresponsable, 
								mant.fechaestimada as festimada, mant.fecharealizada as frealizada, mant.descripcion as descripcion 
				FROM sucursales sucu 
				INNER JOIN mantenimiento mant ON sucu.economico = mant.economico 
				WHERE sucu.economico != 000000 AND sucu.ingresponsable = @responsable 
				ORDER BY sucu.canal ASC, sucu.nombre ASC, mant.fechaestimada DESC 
      `);
	}
};

export const actualizarMantenimientoConConstancia = async (transaction, datos) => {
	const request = new sql.Request(transaction);
	const query = `
    UPDATE mantenimiento 
    SET fecharealizada = @fecharealizada, constancia = @imagen, descripcion = @descripcion 
    WHERE id = @id
  `;
	request.input('fecharealizada', sql.Date, datos.frealizada);
	request.input('imagen', sql.VarBinary(sql.MAX), datos.imagen);
	request.input('descripcion', sql.VarChar, datos.descripcion);
	request.input('id', sql.Numeric, datos.id);
	await request.query(query);
};

export const insertarNuevaFechaEstimada = async (transaction, fechaestimada, economico) => {
	const request = new sql.Request(transaction);
	const query = `
    INSERT INTO mantenimiento(fechaestimada, economico) 
    VALUES (@fechaestimada, @economico)
  `;
	request.input('fechaestimada', sql.Date, fechaestimada);
	request.input('economico', sql.VarChar, economico);
	await request.query(query);
};

/* Comprobar que ID del dispositivo existe para corrobar ejecución */
async function comprobarID(id) {

	try {
		const query = 'SELECT id FROM mantenimiento WHERE id = @id';
		const request = new sql.Request();
		request.input('id', sql.VarChar, id)
		const resultado = await request.query(query);
		return resultado.recordset.length > 0; // El ID exite
	} catch (error) {
		console.error('Error al ejecutar:', error);
		throw error;
	}
}

/* Comprobar que fecha realizada es mayor que fecha estimada */
async function comprobarFechaRealizada(frealizada, id) {
	try {
		const festimada = 'SELECT fechaestimada FROM mantenimiento WHERE id = @id';
		const request = new sql.Request();
		request.input('id', sql.Numeric, id);
		const response = await request.query(festimada); // Ejecutar la consulta   
		let fechaestimada = response.recordset[0].fechaestimada
		let fechaestimadacons = fechaestimada.toISOString();
		fechaestimadacons = fechaestimadacons.split('T')[0]; // "2024-01-17"        
		return fechaestimadacons < frealizada;
	} catch (error) {
		console.error('Error al ejecutar:', error);
		throw error;
	}
}

/* Comprobar que fecha realizada es mayor que fecha estimada */
async function ConstanciaExiste(id) {
	try {
		const query = 'SELECT constancia FROM mantenimiento WHERE id = @id';
		const request = new sql.Request();
		request.input('id', sql.VarChar, id)
		const resultado = await request.query(query);
		return resultado.recordset[0].constancia !== null;// Ya tiene mantenimiento
	} catch (error) {
		console.error('Error al ejecutar:', error);
		throw error;
	}
}

/* Comprobar que ID del dispositivo existe para corrobar ejecución */
async function comprobarSuMantenimiento(id, responsable) {
	try {
		const query = 'SELECT sucu.ingresponsable as ingeniero FROM mantenimiento mante INNER JOIN sucursales sucu ON sucu.economico = mante.economico WHERE mante.id = @id';
		const request = new sql.Request();
		request.input('id', sql.VarChar, id)
		const resultado = await request.query(query);
		const ingeniero = resultado.recordset[0].ingeniero;

		return responsable.toLowerCase() === ingeniero.toLowerCase(); // Si es su mantenimiento
	} catch (error) {
		console.error('Error al ejecutar:', error);
		throw error;
	}
}

/* Saber el economico */
async function ecoSucursal(id) {
	try {
		const query = 'SELECT economico FROM mantenimiento WHERE id = @id';
		const request = new sql.Request();
		request.input('id', sql.VarChar, id)
		const resultado = await request.query(query);

		return resultado.recordset[0].economico;
	} catch (error) {
		console.error('Error al ejecutar:', error);
		throw error;
	}
}

/* Siguiente estimado */
async function nextFEstimada(frealizado) {
	let siguiFEstimada = '';
	let [yy, mm, dd] = frealizado.split('-');
	yy = parseInt(yy);
	mm = parseInt(mm);
	let siguiY = yy;
	if (6 < mm) {
		// console.log('segundo semestre, le toca el primer semestre del otro año');
		siguiY = siguiY + 1;
		siguiFEstimada = `${siguiY}-01-01`;
	} else {
		// console.log('primer semestre, le toca el segundo semestre del mismo otro año');
		siguiFEstimada = `${yy}-07-01`;
	}
	return siguiFEstimada;
};

export {
	comprobarID, comprobarFechaRealizada, ConstanciaExiste, comprobarSuMantenimiento, ecoSucursal, nextFEstimada
};