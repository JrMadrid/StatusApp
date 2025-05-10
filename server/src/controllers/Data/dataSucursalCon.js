/* CONTROLADORES DE LA INFORMACIÓN DE LAS SUCURSALES */
import { listarSucursales } from '../../services/Data/dataSucursalSer.js';

// Pedimos los datos de las sucursales
const getSucursales = async (req, res) => {
    if (req.session.hasOwnProperty('admin')) { // sI se ha validado el usuario
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const responsable = req.session.user;
            const tipo = req.session.tipo;
            let result;
            result = await listarSucursales(responsable, tipo);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
    } else {
        res.redirect('');
    }
};

export default getSucursales;