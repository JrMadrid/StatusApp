/* CONTROLADORES DE INFORMATIVA -- USUARIO */

// Pide el nombre del usuario
const nickname = async (req, res) => {
  try {
    const nickname = req.params.nickname; // Obtiene el nickname del usuario de la URL    
    req.session.nickname = nickname; // Guarda el nickname del usuario en la sesión
    req.session.save(err => { // Guarda la sesión y maneja posibles errores
      if (err) {
        console.error('Error al guardar la sesión:', err);
      }
    });
  } catch (error) {
    console.error('Error :', error);
  }
}

export const methods = {
  nickname
}