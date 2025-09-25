/* CONTROLADORES DE AUTENTICACIÓN DE USUARIOS */
import { loginService, definirTipoUsuario } from '../services/authSer.js';

// Verificar si ya tiene sesión activa
const check = async (req, res) => {
  try {
    // req.session.user debería haberse creado al hacer login
    if (req.session?.user) {
      return res.status(200).json({ admin: req.session?.admin });
    } else {
      // No hay sesión activa
      return res.sendStatus(401);
    }
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return res.sendStatus(500);
  }
};

// Leer y comprobar el usuario
const login = async (req, res) => {
  try {
    const { nickname, psw } = req.body;
    const { usuario, admon, tipo } = await loginService(nickname, psw);

    req.session.user = usuario;
    req.session.admin = admon;
    req.session.login = req.session.user ? true : false; // Se ha iniciado sesión correctamente		

    req.session.tipo = tipo.trim();
    if (tipo !== "Super Administrador") {
      req.session.perfil = usuario;
    }

    req.session.save(err => {
      if (err) {
        console.error('Error al guardar la sesión:', err);
        return res.status(500).json({ message: 'Error al guardar sesión' });
      }
      res.status(200).json({ admin: admon });
    });

  } catch (error) {
    console.error('Error:  // Leer y comprobar el usuario, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error en login' });
  }
};

// Definir el tipo de usuario
const user = async (req, res) => {
  const userInfo = definirTipoUsuario(req.session);
  res.status(200).json(userInfo);
};

// Cerrar sesión
const logout = async (req, res) => {
  console.log('Sesión destruida');
  await req.session.destroy();
  const cierre = !req.session ? true : false;
  res.status(200).json(cierre);
};

export const methods = { check, login, logout, user };