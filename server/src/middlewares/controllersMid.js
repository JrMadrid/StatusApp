/* MIDDLEWARE PARA LOS CONTROLLERS */

// Valida si el usuario tiene sesión iniciada
export function requireUserSession(req, res, next) {  
  // if (req.session.user !== undefined) {
    if (req.session.login === true) {
    next(); // Continua con el siguiente middleware o controlador
  } else {
    res.redirect(''); // Redirige si no ha iniciado sesión
  }
};

// Valida si el usuario tiene sesión de admininistrador
export function requireAdminSession(req, res, next) {  
  if (req.session.admin === true) {
    next(); // Continua con el siguiente middleware o controlador
  } else {
    res.redirect(''); // Redirige si no ha iniciado sesión como administrador
  }
};