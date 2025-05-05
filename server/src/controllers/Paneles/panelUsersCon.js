/* CONTROLADORES DE PANEL DE USUARIOS */
import dbConnection from '../../db/connection.js';
import { IDdelAdmin, NicknameOcupado, comprobarID, nombreResponsable } from '../../models/Paneles/usersMod.js';
import sql from 'mssql';
import bcrypt from 'bcryptjs'; // bcrypt para encriptar la contraseña

const getUsers = async (req, res) => {
    if (req.session.admin) {
        try {
            await dbConnection();
            let result = await sql.query('SELECT id, nickname, psw, tipo FROM users');
            res.status(200).json(result.recordset);

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Error al obtener los datos");
        }
    } else {
        res.redirect('');
    }
};

// Agregamos un nuevo usuario
const postUser = async (req, res) => {
    if (req.session.admin) {
        try {
            await dbConnection();
            let isAdmin = 0;
            let { nickname, psw, tipo } = req.body;
            if (tipo === 'Administrador') {
                isAdmin = 1;
            };
        
            const EsNicknameOcupado = await NicknameOcupado(nickname);
            if (EsNicknameOcupado) {
                res.status(409).json({ message: 'El Nickname definido ya existe en la base de datos. ' });
                return;
            };
            psw = psw.trim(); // Eliminar espacios en blanco al inicio y al final
            psw = await bcrypt.hash(psw, 12); // Encriptar la contraseña, el hash funciona como un algoritmo de encriptación que genera un hash de la contraseña, el 12 indica la complejidad del algoritmo

            const query = 'INSERT INTO users (nickname, psw, isAdmin, tipo) VALUES (@nickname, @psw, @isAdmin, @tipo)';
            const request = new sql.Request();
        
            request.input('nickname', sql.VarChar, nickname);
            request.input('psw', sql.VarChar, psw);
            request.input('isAdmin', sql.Bit, isAdmin);
            request.input('tipo', sql.VarChar, tipo);

            await request.query(query);

            res.status(200).json({ message: 'Usuario agregado exitosamente' });

        } catch (error) {
            console.error('Error agregando nuevos datos:', error);
            res.status(500).json({ message: 'Error agregando nuevos datos' });
        } finally {
            try {
                await sql.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.status(403).json({ message: 'No autorizado' });
    }
};

// Actualizamos un usuario
const updateUser = async (req, res) => {
    if (req.session.admin) {
        let transaction;
        try {
            await dbConnection();
            let isAdmin;
            let { nickname, psw, id, tipo } = req.body;

            psw = psw.trim();
            const Admin = await IDdelAdmin(id)
            const updates = [];

            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontró el ID' });
                return;
            }
            let nick;
            if (nickname.length !== 0) {
                const EsNicknameOcupado = await NicknameOcupado(nickname);
                if (EsNicknameOcupado) {
                    res.status(409).json({ message: 'El Nickname definido ya existe en la base de datos. ' });
                    return;
                } else {
                    updates.push('nickname = @nickname');
                    if (nickname.length !== 0) {
                        const idrequest = new sql.Request();
                        nick = (await idrequest.query(`select nickname from users where id = ${id}`)).recordset[0].nickname;
                    }
                }
            }
            if (psw.length !== 0) {
                psw = await bcrypt.hash(psw, 12); // Encriptar la contraseña 
                updates.push('psw = @psw');
            }
            if (tipo.length !== 0) {
                if (Admin) {
                    res.status(403).json({ message: 'No se puede modificar super administrador' })
                    return;
                }
                else {
                    if (tipo === 'Administrador') {
                        isAdmin = 1;
                    }
                    else {
                        isAdmin = 0;
                    }
                }

                updates.push('tipo = @tipo')
                updates.push('isAdmin = @isAdmin')
            }
            if (updates.length === 0) {
                res.status(400).json({ message: 'No hay datos para actualizar' });
                return;
            }

        
            transaction = new sql.Transaction();
            await transaction.begin();
            const request = new sql.Request(transaction);

            const query = `UPDATE users SET ${updates.join(', ')} WHERE id = @id`;
            request.input('nickname', sql.VarChar, nickname);
            request.input('psw', sql.VarChar, psw);
            request.input('id', sql.Numeric, id);
            request.input('isAdmin', sql.Bit, isAdmin);
            request.input('tipo', sql.VarChar, tipo);

            await request.query('ALTER TABLE sucursales NOCHECK CONSTRAINT FK_ingresponsable');

            await request.query(query);
            if (nickname.length !== 0) {
                await request.query(`UPDATE sucursales SET ingresponsable = '${nickname}' FROM sucursales WHERE ingresponsable = '${nick}'`);
            };
        
            await request.query('ALTER TABLE sucursales CHECK CONSTRAINT FK_ingresponsable');
        
            await transaction.commit();
            res.status(200).json({ message: 'Usuario actualizado exitosamente' });

        } catch (error) {
            console.error('Error actualizando datos:', error);
            res.status(500).json({ message: 'Error actualizando datos' });
        } finally {
            try {
                await sql.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('');
    }
};

// Eliminamos un usuario
const deleteUser = async (req, res) => {
    let transaction;
    if (req.session.admin) {
        try {
            await dbConnection();
            const { id } = req.body;

            const IdExiste = await comprobarID(id);
            if (!IdExiste) {
                res.status(404).json({ message: 'No se encontro el ID' });
                return;
            }
            const Admin = await IDdelAdmin(id);
            if (Admin) {
                res.status(403).json({ message: 'No se puede eliminar al super administrador' });
                return;
            }
            const ingResponsable = await nombreResponsable(id);

            transaction = new sql.Transaction();
            await transaction.begin();
            const request = new sql.Request(transaction);

            const query = 'DELETE FROM users WHERE id = @id';
            request.input('id', sql.Numeric, id);

            await request.query('ALTER TABLE sucursales NOCHECK CONSTRAINT FK_ingresponsable');

            await request.query(`UPDATE sucursales SET ingresponsable = 'Joel Herrera' FROM sucursales WHERE ingresponsable = '${ingResponsable}'`);
            await request.query(query);

            await request.query('ALTER TABLE sucursales CHECK CONSTRAINT FK_ingresponsable');

            await transaction.commit();
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });

        } catch (error) {
            res.status(500).json({ message: 'Error eliminando datos' });
            console.error('Error eliminando datos:', error);
        } finally {
            try {
                await sql.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    } else {
        res.redirect('');
    }
}

// Cerramos la sesión de todos los usuarios
const logoutaAllUsers = async (req, res) => {
    if (req.session.admin) {
        try {
            await dbConnection();
            await sql.query('DELETE FROM Sessions');

        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        res.redirect('');
    }
};

export const methods = {
    postUser,
    getUsers,
    updateUser,
    deleteUser,
    logoutaAllUsers
};