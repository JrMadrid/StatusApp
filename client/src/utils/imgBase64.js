/* FUNCIÓN PARA CONVERTIR UNA IMAGEN EN BASE64 */
const imgBase64 = (url) => {

  return new Promise((resolve, reject) => {
    const img = new Image(); // Crear un nuevo objeto de imagen
    img.crossOrigin = "anonymous"; // Permitir el acceso a imágenes de otros dominios -- Para manejar problemas de CORS

    img.onload = () => { // Cuando la imagen se carga correctamente
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width; // Establecer el tamaño del canvas al de la imagen 
        canvas.height = img.height;
        const ctx = canvas.getContext("2d"); // Obtener el contexto del canvas

        if (ctx) {
          ctx.drawImage(img, 0, 0); // Dibujar la imagen en el canvas
          const dataURL = canvas.toDataURL("image/png"); // Convertir el canvas a una cadena base64
          resolve(dataURL);
        } else {
          reject(new Error("No se pudo obtener el contexto del canvas"));
        }
      } catch (e) {
        reject(new Error(`Error al procesar la imagen: ${e.message}`));
      }
    };

    img.onerror = (error) => { // Manejar errores de carga de la imagen
      reject(new Error(`Error cargando la imagen desde la URL: ${url}, error: ${error.message}`));
    };

    img.src = url;  // Asignar la URL de la imagen a la propiedad src del objeto Image
    // Esto desencadena la carga de la imagen y llama a img.onload cuando se completa
  });
};

export default imgBase64;