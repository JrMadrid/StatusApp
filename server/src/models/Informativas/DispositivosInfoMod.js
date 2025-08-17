/* MODEL DE INFORMATIVA -- DISPOSITIVOS */
import sql from 'mssql';

// Mandar los dispositivos con ese nombre
export const obtenerDispositivosNombre = async (dispositivo, responsable, tipo) => {
	const request = new sql.Request();
	let query;
	if (tipo === 'Geografia') {
		query = `
				SELECT dispo.id AS id, dispo.nombre AS nombre, dispo.ip AS ip, sucu.nombre AS sucursal, sucu.economico AS economico
				FROM dispositivos dispo
				INNER JOIN sucursales sucu ON dispo.economico = sucu.economico
				WHERE dispo.nombre = @dispositivo AND sucu.ingresponsable = @responsable
				ORDER BY sucu.canal ASC, sucu.nombre ASC
		`;
	} else {
		query = `
        SELECT dispo.id AS id, dispo.nombre AS nombre, dispo.ip AS ip, sucu.nombre AS sucursal, sucu.economico AS economico
        FROM dispositivos dispo
        INNER JOIN sucursales sucu ON dispo.economico = sucu.economico
        WHERE dispo.nombre = @dispositivo
        ORDER BY sucu.canal ASC, sucu.nombre ASC
        `;
	};
	request.input('dispositivo', sql.VarChar, dispositivo);
	request.input('responsable', sql.VarChar, responsable);
	return (await request.query(query)).recordset;
};

// Pedir los datos de los dispositivos
export const obtenerInfoDispositivos = async (dispositivo, responsable, tipo) => {
	const request = new sql.Request();
	let query;
	if (tipo === 'Geografia') {
		query = `
					SELECT sucu.nombre AS sucursal, sucu.economico AS economico, 
									dispo.nombre AS nombre,	dispo.id AS id, dispo.descripcion AS descripcion, dispo.general AS general, dispo.ip AS ip
					FROM sucursales sucu
					INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico
					WHERE dispo.nombre = @dispositivo AND sucu.ingresponsable = @responsable
					ORDER BY sucu.canal ASC, sucu.nombre ASC
		`;
	} else {
		query = `
		SELECT sucu.nombre AS sucursal, sucu.economico AS economico, sucu.ingresponsable AS ingresponsable,
									dispo.id AS id, dispo.nombre AS nombre, dispo.descripcion AS descripcion, dispo.general AS general, dispo.ip AS ip
									FROM sucursales sucu
					INNER JOIN dispositivos dispo ON sucu.economico = dispo.economico
					WHERE dispo.nombre = @dispositivo
					ORDER BY sucu.canal ASC, sucu.nombre ASC
					`;
	};
	request.input('dispositivo', sql.VarChar, dispositivo);
	request.input('responsable', sql.VarChar, responsable);
	return (await request.query(query)).recordset;
};