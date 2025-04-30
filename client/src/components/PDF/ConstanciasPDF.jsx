/* COMPONENTE QUE GUARDA EN PDF TODAS LAS CONSTANCIAS */
import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { Toaster, toast } from 'react-hot-toast';
import '../css/PDF.css';

export default function PDFConstancias({ images, title = 'Reporte de Mantenimiento', eco }) {
    const [imageData, setImageData] = useState([]);

    const convertBufferToGrayscale = (buffer) => {
        return new Promise((resolve, reject) => {
            try {
                const uint8Array = new Uint8Array(buffer);  // Convertir el buffer a un Uint8Array
                const blob = new Blob([uint8Array], { type: 'image/jpeg' });  // Crear un Blob con la imagen
                const reader = new FileReader();

                reader.onloadend = () => {
                    const img = new Image();
                    img.src = reader.result;

                    img.onload = () => {
                        // Crear un canvas para convertir la imagen a escala de grises
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
                            pixels[i] = avg; // Rojo
                            pixels[i + 1] = avg; // Verde
                            pixels[i + 2] = avg; // Azul
                        }

                        // Poner los datos de píxeles modificados en el canvas
                        ctx.putImageData(imageData, 0, 0);

                        // Convertir la imagen procesada a Base64 y devolverla
                        const grayscaleBase64 = canvas.toDataURL(); // Convertir a Base64
                        resolve(grayscaleBase64); // Devolver la imagen en Base64
                    };

                    img.onerror = reject; // Manejar errores de carga de imagen
                };

                reader.onerror = reject; // Manejar errores de lectura
                reader.readAsDataURL(blob);  // Convertir el Blob a Base64
            } catch (error) {
                reject(error);  // Si ocurre un error, devolverlo
            }
        });
    };

    // Convertir todas las imágenes (Buffer) a Base64 y luego a blanco y negro
    useEffect(() => {
        if (images.length > 0) {
            Promise.all(
                images.map((image) => {
                    // Verificamos si la imagen es válida (no null) antes de convertirla
                    if (image && image.data) {
                        return convertBufferToGrayscale(image.data); // Convertimos el Buffer a escala de grises (Base64)
                    }
                    return null; // Si la imagen es null, no la procesamos
                })
            )
                .then((base64Images) => {
                    // Filtrar imágenes nulas (si alguna no se pudo convertir)
                    const validImages = base64Images.filter((image) => image !== null);
                    setImageData(validImages); // Almacenamos las imágenes procesadas en base64
                })
                .catch((error) => {
                    console.error("Error al convertir las imágenes:", error);
                    toast.error("Hubo un error al procesar las imágenes.");
                });
        }
    }, [images]);

    // Función para generar el PDF con las imágenes (cada una en su propia página)
    const downloadPDF = () => {
        if (imageData.length === 0) {
            toast.error('No se pudieron procesar las imágenes. Intente nuevamente.');
            return;
        }

        const docDefinition = {
            pageSize: { width: 612, height: 792 }, // Tamaño carta en puntos (8.5 x 11 pulgadas)
            pageMargins: [0, 0, 0, 0], // Sin márgenes para que la imagen ocupe toda la página
            content: imageData.map((image, index) => ({
                image, // Usamos la imagen procesada en Base64 (en escala de grises)
                width: 612, // Ancho máximo (ocupa toda la página)
                height: 792, // Alto máximo (ocupa toda la página)
                alignment: 'center',
                pageBreak: index < imageData.length - 1 ? 'after' : undefined, // Añadir salto de página después de cada imagen, excepto la última
            })),
        };

        const filename = `${title.replace(/\s+/g, '_')}_${eco}.pdf`; // Generar un nombre de archivo basado en el título
        pdfMake.createPdf(docDefinition).download(filename); // Descargar el PDF generado
        toast.success('Constancias PDF', { position: 'bottom-right' });
    };

    return (
        <>
            <button onClick={downloadPDF} className="pdfAll">Guardar Constancias</button>

            <Toaster />
        </>
    );
};