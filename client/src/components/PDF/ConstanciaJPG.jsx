/* DESCARGAR IMAGEN DE LA CONSTANCIA */
import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FormatearFecha } from '../Elements/date';
import '../css/PDF.css';

const JPGConstancia = ({ imageBlob, eco, fechaco }) => {

    const fechacons = FormatearFecha(fechaco);

    const handleDownload = () => {
        if (imageBlob) {
            const url = URL.createObjectURL(imageBlob); // Crear una URL temporal para el Blob
            const a = document.createElement('a'); // Crear un enlace (elemento <a>)
            a.href = url; // Asignar la URL temporal como destino del enlace
            a.download = `Constancia_${eco}_${fechacons}.jpg`; // Nombre del archivo con extensión .jpg
            a.click(); // Simular un clic para iniciar la descarga
            URL.revokeObjectURL(url); // Revocar la URL temporal después de la descarga
            toast(`Constancia ${fechacons}`, { position: 'bottom-right' }); // Notificación
        }
    };

    return (
        <div>
            <button onClick={handleDownload} className="pdfSelected" style={{ right: '70%' }}>
                Guardar Imagen
            </button>

            <Toaster />
        </div>

    );
};

export default JPGConstancia;