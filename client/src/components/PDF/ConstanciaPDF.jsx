/* COMPONENTE QUE GUARDA EN PDF LA CONSTANCIA SELECCIONADA */
import { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { Toaster, toast } from 'react-hot-toast';
import { FormatearFecha } from '../Elements/date';
import '../css/PDF.css';

export default function PDFConstancia({ imageBlob, eco, title = 'Reporte de Mantenimiento', fechaco }) {
  const [imageData, setImageData] = useState(null);

  const fechacons = FormatearFecha(fechaco);

  // Función para convertir la imagen en escala de grises usando Canvas
  const convertImageToGrayscale = (imageBlob) => {
    return new Promise((resolve, reject) => {
      const img = new Image(); // Crear un nuevo objeto de imagen
      const reader = new FileReader(); // Crear un nuevo objeto FileReader

      reader.onloadend = function () {
        img.src = reader.result; // Asignar la URL de la imagen al objeto Image
      };

      reader.onerror = reject; // Manejar errores de lectura
      reader.readAsDataURL(imageBlob); // Leer el Blob como URL de datos

      img.onload = function () { // Cuando la imagen se carga
        const canvas = document.createElement('canvas'); // Crear un canvas para procesar la imagen
        const ctx = canvas.getContext('2d'); // Obtener el contexto 2D del canvas
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0); // Dibujar la imagen en el canvas

        // Obtener los datos de píxeles y aplicar filtro en escala de grises
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Obtener los datos de la imagen
        const pixels = imageData.data; // Obtener los datos de píxeles

        for (let i = 0; i < pixels.length; i += 4) {
          const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3; // Promedio de los 3 colores RGB
          pixels[i] = avg; // Red
          pixels[i + 1] = avg; // Green
          pixels[i + 2] = avg; // Blue
        }

        // Poner los datos de píxeles modificados en el canvas
        ctx.putImageData(imageData, 0, 0);

        // Convertir la imagen procesada a Base64 y devolverla
        const grayscaleBase64 = canvas.toDataURL();
        resolve(grayscaleBase64);
      };
    });
  };

  // Convertir la imagen y almacenar el resultado
  useEffect(() => {
    if (imageBlob) {
      convertImageToGrayscale(imageBlob).then((grayscaleImage) => {
        setImageData(grayscaleImage); // Guardar la imagen en escala de grises
      }).catch(error => console.error("Error al convertir la imagen:", error));
    }
  }, [imageBlob]);

  // Función para generar el PDF con la imagen en escala de grises
  const downloadPDF = () => {
    if (!imageData) {
      alert('No se pudo procesar la constancia. Intente nuevamente.');
      return;
    }

    const docDefinition = {
      pageSize: { width: 612, height: 792 }, // Tamaño carta en puntos (8.5 x 11 pulgadas)
      pageMargins: [0, 0, 0, 0], // Sin márgenes para que la imagen ocupe toda la página
      content: [
        {
          image: imageData, // Usamos la imagen procesada en escala de grises
          width: 612, // Ancho máximo (ocupa toda la página)
          height: 792, // Alto máximo (ocupa toda la página)
          alignment: 'center'
        },
      ],
    };

    const filename = `${title.replace(/\s+/g, '_')}_${eco}_${fechacons}.pdf`; // Generar un nombre de archivo basado en el título

    pdfMake.createPdf(docDefinition).download(filename); // Descargar el PDF generado
    toast(`Mantenimiento PDF ${fechacons}`, { position: 'bottom-right' });
  };

  return (
    <>
      <button onClick={downloadPDF} className="pdfSelected">Guardar Documento</button>
      <Toaster />
    </>
  );
};