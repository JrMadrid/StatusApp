/* MIDDLEWARE PARA LOS CONTROLLERS */

// Valida si el usuario tiene sesión de admininistrador
export function requireUserSession(req, res, next) {
  if (req.session.user !== undefined) {
    next(); // Continua con el siguiente middleware o controlador
  } else {
    res.redirect(''); // Redirige si no es admin
  }
};

// Valida si el usuario tiene sesión de admininistrador
export function requireAdminSession(req, res, next) {
  if (req.session.admin === true) {
    next(); // Continua con el siguiente middleware o controlador
  } else {
    res.redirect(''); // Redirige si no es admin
  }
};
