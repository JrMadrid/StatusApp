/* COMPONENTE QUE GUARDA EN PDF TODA LA INFORMACION */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Toaster, toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import date from '../../utils/date.js';
import imgBase64 from '../../utils/imgBase64.js';
import logo from '../../imgs/LogoSoporteBN.png';
import hn from '../../imgs/hnBN.png';

export default function ALLPDF(props) {
    const user = useContext(UserContext);
    const fecha = date();

    const downloadPDF = async () => {
        const doc = new jsPDF();
        const logoBase64 = await imgBase64(logo);
        const hnBase64 = await imgBase64(hn);

        const pageHeight = doc.internal.pageSize.getHeight();
        const bottomMargin = 10;
        const topMargin = 30;
        const usableHeight = pageHeight - bottomMargin;

        let y = topMargin;

        // Esta función imprime texto línea por línea y salta de página cuando es necesario
        function printTextWithAutoPageBreak(lines, x, lineHeight = 7) {
            lines.forEach(line => {
                if (y + lineHeight > usableHeight) {
                    doc.addPage();
                    y = topMargin;
                }
                doc.text(line, x, y);
                y += lineHeight;
            });
        }

        props.data.forEach((item, index) => {
            if (index > 0) {
                doc.addPage();
                y = topMargin;
            }

            // --- HEADER ---
            doc.addImage(logoBase64, 'PNG', 20, 10, 15, 0);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Soporte Técnico Honduras', 105, 20, { align: 'center' });
            doc.addImage(hnBase64, 'PNG', 170, 15, 20, 0);

            y = topMargin;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            
            // --- INGENIERO RESPONSABLE ---
            const ingText = (user.id === 4)
                ? `Ing. ${user.username}`
                : `Ingeniero responsable: ${item.ingresponsable}`;
            const splitIng = doc.splitTextToSize(ingText, 180);
            printTextWithAutoPageBreak(splitIng, 15);

            // --- DATOS DE SUCURSAL ---
            const sucursalLine = `${item.economico || 'N/A'} ${item.sucursal || 'Económico un Dispositivo'}`;
            const splitSucursal = doc.splitTextToSize(sucursalLine, 180);
            printTextWithAutoPageBreak(splitSucursal, 15);

            const ipLabel = item.ip.startsWith('000.') ? 'Sin inventario' : item.ip.startsWith('001.') ? 'No aplica' : item.ip;
            const dispositivoLine = `${item.nombre || 'Nombre del dispositivo'} ${ipLabel}`;
            const splitDispositivo = doc.splitTextToSize(dispositivoLine, 180);
            printTextWithAutoPageBreak(splitDispositivo, 15);

            // --- DESCRIPCIÓN ---
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            const splitDescripcion = doc.splitTextToSize(item.descripcion || 'Descripción del dispositivo.', 180);
            printTextWithAutoPageBreak(splitDescripcion, 15);

            // --- INFORMACIÓN GENERAL ---
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            printTextWithAutoPageBreak(['Información General'], 15);

            doc.setFont('helvetica', 'normal');
            const splitGeneral = doc.splitTextToSize(item.general || 'Información General.', 180);
            printTextWithAutoPageBreak(splitGeneral, 15);

            // --- FOOTER ---
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            if (y + 15 > usableHeight) {
                doc.addPage();
                y = topMargin;
            }
            doc.text(`Tipo de Reporte: ${props.titulo}`, 15, pageHeight - 10);
            doc.text(`Fecha de Generación: ${fecha}`, 196, pageHeight - 10, { align: 'right' });
        });

        let filename = 'reporte.pdf';
        let tostada = 'No hay información';
        if (props.guardado === 'apps' && props.data.length !== 0) {
            filename = `${props.data[0].economico || ' '}-Dispositivos.pdf`;
            tostada = `Dispositivos de ${props.data[0].economico || ' '}`;
        } else if (props.guardado === 'devices' && props.data.length !== 0) {
            filename = `${props.data[0].nombre || ' '}-Sucursales.pdf`;
            tostada = `Sucursales con ${props.data[0].nombre || ' '}`;
        }

        doc.save(filename);
        toast(tostada, { position: 'bottom-right' });
    };

    return (
        <>
            {props && props.data.length !== 0 && (
                <button className='pdfAll' onClick={downloadPDF} type="button">
                    {props.titulo}
                </button>
            )}
            <Toaster />
        </>
    );
};