/* CONTROLADORES DE PANEL DE SUCURSALES */
import { obtenerSucursales, agregarSucursal, actualizarSucursal, eliminarSucursal } from '../../services/Paneles/panelSucursalSer.js';

// Pedimos los datos de las sucursales
const getSucursales = async (req, res) => {
	if (req.session.admin) {
		try {
			const sucursales = await obtenerSucursales();
			res.status(200).json(sucursales);
		} catch (error) {
			console.error('Error:', error);
			res.status(500).send("Error al obtener los datos");
		}
	} else {
		res.redirect('');
	}
};

// Agregamos una nueva sucursal
const postSucursal = async (req, res) => {
	if (req.session.admin) {
		try {
			const { economico, canal, nombre, ingresponsable, rellenar } = req.body;
			await agregarSucursal(economico, canal, nombre, ingresponsable, rellenar);

			res.status(200).json({ message: 'Sucursal agregado exitosamente' });
		} catch (error) {
			console.error('Error agregando nuevos datos:', error);
			res.status(error.status || 500).json({ message: error.message || 'Error agregando nuevos datos' });
		}
	} else {
		res.redirect('');
	}
};

// Actualizamos una sucursal
const updateSucursal = async (req, res) => {
	if (req.session.admin) {
		try {
			const { economico, canal, nombre, id, ingresponsable, rellenar } = req.body;

			await actualizarSucursal(economico, canal, nombre, id, ingresponsable, rellenar);
			res.status(200).json({ message: 'Sucursal actualizado exitosamente' });

		} catch (error) {
			console.error('Error actualizando datos:', error);
			res.status(error.status || 500).json({ message: error.message || 'Error actualizando datos' });
		}
	} else {
		res.redirect('');
	}
};

// Eliminamos una sucursal
const deleteSucursal = async (req, res) => {
	if (req.session.admin) {
		try {
			const { id } = req.body;
			await eliminarSucursal(id);

			res.status(200).json({ message: 'Sucursal eliminada exitosamente' });
		} catch (error) {
			res.status(error.status || 500).json({ message: error.message || 'Error eliminando datos' });
			console.error('Error eliminando datos:', error);
		}
	} else {
		res.redirect('');
	}
};

export const methods = {
	getSucursales,
	postSucursal,
	updateSucursal,
	deleteSucursal
};