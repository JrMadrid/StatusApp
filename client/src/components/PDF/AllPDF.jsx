/* COMPONENTE QUE GUARDA EN PDF TODA LA INFORMACION */
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import pdfMake from 'pdfmake/build/pdfmake';
import { Toaster, toast } from 'react-hot-toast';
import date from '../../utils/date.js';
import imgBase64 from '../../utils/imgBase64.js';
import '../css/PDF.css';
import logo from '../../imgs/LogoSoporteBN.png';
import hn from '../../imgs/hnBN.png';

export default function ALLPDF(props) {
    const user = useContext(UserContext);
    const fecha = date();

    const downloadPDF = async () => {

        const logoBase64 = await imgBase64(logo);
        const hnBase64 = await imgBase64(hn);

        // Construir el contenido del PDF basado en los datos
        const docDefinition = {
            pageSize: 'A4', // Tamaño de página A4 estándar
            pageMargins: [30, 20, 30, 40], // Márgenes de la página: [izquierda, arriba, derecha, abajo]

            content: props.data.flatMap((item, index) => [
                {
                    columns: [
                        { image: logoBase64, width: 25, margin: [0, 10, 0, 0], alignment: 'left' },
                        { text: 'Soporte Técnico Honduras', style: 'header', width: '*', alignment: 'center' },
                        { image: hnBase64, width: 40, margin: [0, 10, 5, 0], alignment: 'right' },
                    ],
                    margin: [0, 0, 0, 4]
                },
                { text: `${(user.id === 4) ? `Ing. ${user.username}` : ''}`, style: 'subheader' },
                { text: `${(user.id !== 4) ? `Ingeniero responsable: ${item.ingresponsable}` : ''}`, style: 'subheader' },
                { text: `${item.economico || 'N/A'} ${item.sucursal || 'Económico un Dispositivo'}`, style: 'subheader' }, // Subtítulo con datos dinámicos
                { text: `${item.nombre || 'Nombre del dispositivo'} ${item.ip.startsWith('000.') ? 'Sin inventario' : item.ip.startsWith('001.') ? 'No aplica' : item.ip}`, style: 'subheader' },
                { text: item.descripcion || 'Descripción del dispositivo.', style: 'text' },
                { text: 'Información General', style: 'sectionHeader' },
                { text: item.general || 'Información General.', style: 'text' },
                {
                    columns: [
                        { text: `Tipo de Reporte: ${props.titulo}`, style: 'footer1' },
                        { text: `Fecha de Generación: ${fecha}`, style: 'footer2' },
                    ],
                    margin: [0, 0, 0, 20] // Margen alrededor de la fila de columnas
                },
                { text: '', pageBreak: 'after' } // Salto de página después de cada bloque de contenido
            ]),
            styles: {
                header: {
                    fontSize: 22, // Tamaño de fuente para el encabezado
                    bold: true, // Fuente en negrita
                    margin: [0, 10, 0, 10] // Ajustar margen para el texto del encabezado
                },
                subheader: {
                    fontSize: 16, // Tamaño de fuente para el subtítulo
                    bold: true, // Fuente en negrita
                    margin: [0, 0, 0, 10] // Margen alrededor del texto
                },
                sectionHeader: {
                    fontSize: 12, // Tamaño de fuente para los encabezados de sección
                    bold: true, // Fuente en negrita
                    margin: [0, 10, 0, 5] // Margen alrededor del texto
                },
                text: {
                    fontSize: 12, // Tamaño de fuente para el texto general
                    margin: [0, 0, 0, 10] // Margen alrededor del texto
                },
                footer1: {
                    fontSize: 10, // Tamaño de fuente para el pie de página
                    margin: [0, 10, 0, 0], // Margen superior e inferior
                    alignment: 'left' // Alinear a la izquierda
                },
                footer2: {
                    fontSize: 10, // Tamaño de fuente para el pie de página
                    margin: [0, 10, 0, 0], // Margen superior e inferior
                    alignment: 'right' // Alinear a la derecha
                }
            },
        };
        let tostada = `No hay información`
        let guardado = `reporte.pdf`
        if (props.guardado === 'apps' && props.data.length !== 0) {
            guardado = `${props.data[0].economico || ' '}-Dispositivos.pdf`;
            tostada = `Dispositivos de ${props.data[0].economico || ' '}`
        }
        else if (props.guardado === 'devices' && props.data.length !== 0) {
            guardado = `${props.data[0].nombre || ' '}-Sucursales.pdf`;
            tostada = `Sucursales con ${props.data[0].nombre || ' '}`
        }
        pdfMake.createPdf(docDefinition).download(guardado); // Crear y descargar el PDF con el nombre 'Reporte.pdf'
        toast(tostada, { position: 'bottom-right' });
    }

    return (
        <>
            {props && props.data.length !== 0 && (
                <>
                    <button className='pdfAll' onClick={downloadPDF} type="button">{props.titulo}</button>
                </>
            )}
            <Toaster />
        </>
    );
};