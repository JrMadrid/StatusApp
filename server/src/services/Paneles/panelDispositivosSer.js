/* SERVICIOS PARA VALIDAR DATOS DE DISPOSITIVOS */
import { getDispositivos, postDispositivo, updateDispositivo, deleteDispositivo, SucursalExiste, IpOcupada, comprobarID } from '../../models/Paneles/panelDispositivosMod.js';

/* Obtener todos los dispositivos registrados */
export async function obtenerDispositivos() {
	return await getDispositivos();
};

/* Agregar un nuevo dispositivo con validaciones */
export async function agregarDispositivo({ economico, ip, nombre, descripcion, general }) {
	const isEconomicoValid = await SucursalExiste(economico);
	if (!isEconomicoValid) throw { code: 404, message: 'Sucursal no válida' };

	const esIpOcupada = await IpOcupada(ip);
	if (esIpOcupada) throw { code: 406, message: 'IP ocupada' };

	await postDispositivo({ economico, ip, nombre, descripcion, general });
};

/* Actualizar un dispositivo existente */
export async function actualizarDispositivo(data) {
	const { id } = data;
	const idExiste = await comprobarID(id);
	if (!idExiste) throw { code: 404, message: 'ID no válido' };

	await updateDispositivo(data);
};

/* Eliminar un dispositivo con seguridad */
export async function eliminarDispositivo(id) {
	const idExiste = await comprobarID(id);
	if (!idExiste) throw { code: 404, message: 'ID no válido' };

	await deleteDispositivo(id);
};