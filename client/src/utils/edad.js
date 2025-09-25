/* FUNCIÓN PARA CALCULAR LA EDAD CON LAS FECHAS DADAS POR SQL ISO 8601 */
function calcularEdad(fechaISO) {
  if (!fechaISO) return null;

  const fechaNacimiento = new Date(fechaISO); // JS interpreta el ISO directamente
  const hoy = new Date();

  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mesDiff = hoy.getMonth() - fechaNacimiento.getMonth();
  const diaDiff = hoy.getDate() - fechaNacimiento.getDate();

  if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) {
    edad--;
  }

  return edad;
};

export default calcularEdad;