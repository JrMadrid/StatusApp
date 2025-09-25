/* CONEXIÓN A LA API */
/* Función asíncrona para obtener datos desde una URL */
const fetchData = async (url) => {
  try {
    const response = await fetch(url, { credentials: 'include' }); // Incluir credenciales (cookies) en la solicitud
    if (!response.ok) {
      throw new Error('Sin respuesta');
    }
    return response;

  } catch (error) {
    console.error('Error consiguiendo los datos: ', error.message);
  }
};

export default fetchData; 