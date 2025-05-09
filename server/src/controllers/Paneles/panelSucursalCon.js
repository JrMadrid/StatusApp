/* CONTROLADORES DE PANEL DE SUCURSALES */
// import dbConnection from '../../db/connection.js';
import sql from 'mssql';
import { EconomicoOcupado, comprobarID, Neconomico, IngResponsable } from '../../models/Paneles/panelSucursalMod.js';
import e from 'express';

// Pedimos los datos de las sucursales
const getSucursales = async (req, res) => {
    if (req.session.admin) {
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const result = await sql.query('SELECT id, economico, canal, nombre, ingresponsable FROM sucursales WHERE economico != 000000 ORDER BY canal ASC, nombre ASC');
            res.status(200).json(result.recordset);
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
    function obtenerNumeroAleatorio() {
        return Math.floor(Math.random() * 250) + 1;
    }
    if (req.session.admin) {
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const { economico, canal, nombre, ingresponsable, rellenar } = req.body;

            let dispos;
            const EsEconomicoOcupado = await EconomicoOcupado(economico);
            if (EsEconomicoOcupado) {
                res.status(406).json({ message: 'El Economico definido ya existe en la base de datos' });
                return;
            }

            const IngExiste = await IngResponsable(ingresponsable);
            if (!IngExiste) {
                res.status(404).json({ message: 'No se encontro el ing. Responsable' });
                return;
            }

            const query = 'INSERT INTO sucursales (economico, canal, nombre, ingresponsable) VALUES (@economico, @canal, @nombre, @ingresponsable)';
            const request = new sql.Request();

            request.input('economico', sql.VarChar, economico);
            request.input('canal', sql.VarChar, canal);
            request.input('nombre', sql.VarChar, nombre);
            request.input('ingresponsable', sql.VarChar, ingresponsable);

            await request.query(query);

            if (rellenar === 'yes') {
                dispos = (await sql.query(`SELECT dispo.nombre from dispositivos dispo INNER JOIN sucursales sucu ON sucu.economico = dispo.economico GROUP BY dispo.nombre`)).recordset;
                for (let i = 0; i < dispos.length; i++) {
                    let ip = `000.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}.${obtenerNumeroAleatorio()}`
                    await request.query(`INSERT INTO dispositivos ([ip],[economico],[nombre]) VALUES ('${ip}','${economico}','${dispos[i].nombre}')`)
                }
            };

            res.status(200).json({ message: 'Sucursal agregado exitosamente' });
        } catch (error) {
            console.error('Error agregando nuevos datos:', error);
            res.status(500).json({ message: 'Error agregando nuevos datos' });
        } 
    } else {
        res.redirect('');
    }
};

// Actualizamos una sucursal
const updateSucursal = async (req, res) => {
    function obtenerNumeroAleatorio() {
        return Math.floor(Math.random() * 250) + 1;
    }
    if (req.session.admin) {
        let transaction;
        try {
            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;
            const { economico, canal, nombre, id, ingresponsable, rellenar } = req.body;

            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontro el ID' });
                return;
            }
            let economicoRellenar = '';
            if (rellenar === 'yes') { // Si quiere rellenar
                if (economico.length !== 0) { // Cambiar el economico ya que serian diferentes
                    economicoRellenar = economico
                }
                else { // No cambiar el economico ya que serian diferentes
                    economicoRellenar = (await sql.query(`SELECT economico from sucursales WHERE id = '${id}'`)).recordset[0].economico; // Para identificar a que economico se le va a rellenar los dispositivos
                }
            }

            const EsEconomicoOcupado = await EconomicoOcupado(economico)
            if (EsEconomicoOcupado) {
                res.status(406).json({ message: 'El Economico definido ya existe en la base de datos' });
                return;
            }
            if (ingresponsable.length !== 0) {
                const IngExiste = await IngResponsable(ingresponsable);
                if (!IngExiste) {
                    res.status(404).json({ message: 'No se encontro el ing. Responsable' });
                    return;
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
                res.status(400).json({ message: 'No hay datos para actualizar' });
                return;
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
            res.status(200).json({ message: 'Sucursal actualizado exitosamente' });

        } catch (error) {
            if (transaction) {
                try {

                    await transaction.rollback();
                } catch (rollbackError) {
                    console.error('Error al revertir la transacción:', rollbackError);
                }
            }
            console.error('Error actualizando datos:', error);
            res.status(500).json({ message: 'Error actualizando datos' });
        } 
    } else {
        res.redirect('');
    }
};

// Eliminamos una sucursal
const deleteSucursal = async (req, res) => {
    if (req.session.admin) {
        let transaction;
        try {

            // await dbConnection(); solo se inicia la conexion al arrancar el servidor;

            const { id } = req.body;

            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontró el ID' });
                return;
            }

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

            res.status(200).json({ message: 'Sucursal eliminada exitosamente' });

        } catch (error) {
            if (transaction) {
                try {

                    await transaction.rollback();
                } catch (rollbackError) {
                    console.error('Error al revertir la transacción:', rollbackError);
                }
            }
            res.status(500).json({ message: 'Error eliminando datos' });
            console.error('Error eliminando datos:', error);

        } 
    } else {
        res.redirect('');
    }
}

export const methods = {
    getSucursales,
    postSucursal,
    updateSucursal,
    deleteSucursal
}