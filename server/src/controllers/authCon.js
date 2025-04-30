/* CONTROLADORES DE AUTENTICACIÓN DE USUARIOS*/
import { comprobarUsuario } from '../models/authMod.js';

// Leer y comprobar el usuario
const login = async (req, res) => {
    try {
        const { nickname, psw } = req.body;

        const { usuario, admon, tipo, error } = await comprobarUsuario(nickname, psw);

        if (error) {
            res.status(401).send({ error: error });
        }

        if (usuario) {
            req.session.admin = admon;
            req.session.user = nickname;
            req.session.tipo = tipo.trim();

            req.session.save(err => {
                if (err) {
                    console.error('Error al guardar la sesión:', err);
                    return res.status(500).send({ error: 'Error al guardar sesión' });
                }
                res.status(200).send({ admin: admon });
            });
        };

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send({ error: 'Error en login' });
    }
};

// Definimos el tipo de usuario.
const user = async (req, res) => {
    const user = {
        username: req.session.user,
        isAdmin: req.session.admin,
        tipo: req.session.tipo,
        id: 0
    };
    if (req.session.admin == undefined) {
        return res.json(user);
    } else {
        if (req.session.admin == true) {
            if (req.session.tipo === 'Super Administrador') {
                user.id = 1
                return res.json(user);
            }
            else {
                user.id = 2
                return res.json(user);
            }
        } else {
            if (req.session.tipo === 'Aplicativo') {
                user.id = 3
                return res.json(user);
            }
            else {
                user.id = 4
                return res.json(user);
            }
        }
    };
}

// Cerrar sesión
const logout = async (req, res) => {
    console.log('Sessión Destruida');
    await req.session.destroy(); // Destruye la sesión
    const cierre = !req.session ? true : false;    
    res.status(200).json(cierre);
};

export const methods = {
    login, logout, user
};