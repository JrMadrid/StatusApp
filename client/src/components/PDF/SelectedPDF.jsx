/* COMPONENTE QUE GUARDA EN PDF LA INFORMACION SELECCIONADA */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import jsPDF from 'jspdf';
import { Toaster, toast } from 'react-hot-toast';
import date from '../../utils/date.js';
import imgBase64 from '../../utils/imgBase64.js';
import '../css/PDF.css';
import logo from '../../imgs/LogoSoporteBN.png';
import hn from '../../imgs/hnBN.png';

export default function PDF(props) {
  const user = useContext(UserContext);
  const fecha = date();

  const downloadPDF = async () => {
    try {
      const doc = new jsPDF();
      const logoBase64 = await imgBase64(logo);
      const hnBase64 = await imgBase64(hn);

      const pageHeight = doc.internal.pageSize.getHeight();
      const bottomMargin = 10;
      const topMargin = 30;
      const usableHeight = pageHeight - bottomMargin;
      let y = topMargin;

      const printTextWithAutoPageBreak = (lines, x = 15, lineHeight = 7) => {
        lines.forEach(line => {
          if (y + lineHeight > usableHeight) {
            doc.addPage();
            addHeader();
            y = topMargin;
          }
          doc.text(line, x, y);
          y += lineHeight;
        });
      };

      const addHeader = () => {
        doc.addImage(logoBase64, 'PNG', 20, 10, 15, 0);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Soporte Técnico Honduras', 105, 20, { align: 'center' });
        doc.addImage(hnBase64, 'PNG', 170, 15, 20, 0);
      };

      const addFooter = () => {
        // const currentPage = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Tipo de Reporte: ${props.titulo}`, 15, pageHeight - 10);
        doc.text(`Fecha de Generación: ${fecha}`, 196, pageHeight - 10, { align: 'right' });
        // doc.text(`Página ${currentPage}`, 105, pageHeight - 10, { align: 'center' });
      };

      // INICIO PDF
      addHeader();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);

      // --- INGENIERO RESPONSABLE ---
      const ingText = (user.id === 4)
        ? `Ing. ${user.username}`
        : `Ingeniero responsable: ${props.ingresponsable}`;
      const splitIng = doc.splitTextToSize(ingText, 180);
      printTextWithAutoPageBreak(splitIng, 15);

      // --- DATOS DE SUCURSAL ---
      const sucursalLine = `${props.economico || 'Económico'} ${props.sucursal || 'Sucursal'}`;
      const dispositivoLine = `${props.nombre || 'Nombre del dispositivo'} ${props.ip || 'IP del dispositivo'}`;
      const splitSucursal = doc.splitTextToSize(sucursalLine, 180);
      const splitDispositivo = doc.splitTextToSize(dispositivoLine, 180);
      printTextWithAutoPageBreak(splitSucursal, 15);
      printTextWithAutoPageBreak(splitDispositivo, 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const descripcionLines = doc.splitTextToSize(props.descripcion || 'Descripción del dispositivo.', 180);
      printTextWithAutoPageBreak(descripcionLines);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      printTextWithAutoPageBreak(['Información Importante']);

      doc.setFont('helvetica', 'normal');
      const infoImportante = [
        props.informacionimportante || '',
        props.informacionimportante2 || '',
        props.informacionrelevante || ''
      ];
      printTextWithAutoPageBreak(infoImportante);

      doc.setFont('helvetica', 'bold');
      printTextWithAutoPageBreak(['Información Técnica']);

      doc.setFont('helvetica', 'normal');
      printTextWithAutoPageBreak([props.informaciontecnica || 'Información Técnica.']);

      doc.addPage();
      addHeader();
      y = topMargin;

      doc.setFont('helvetica', 'bold');
      printTextWithAutoPageBreak(['Información General']);

      doc.setFont('helvetica', 'normal');
      const generalLines = doc.splitTextToSize(props.informaciongeneral || 'Información General.', 180);
      printTextWithAutoPageBreak(generalLines);

      // FOOTER FINAL -- numeros de pagina (no funciono)
      // const totalPages = doc.internal.getNumberOfPages();
      // for (let i = 1; i <= totalPages; i++) {
      //     doc.setPage(i);
      addFooter();
      // }

      const nombreArchivo = `${props.nombre}_${props.economico}.pdf`;
      toast(`${props.nombre} de la ${props.economico}`, { position: 'bottom-right' });
      doc.save(nombreArchivo);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  return (
    <>
      {props && props.informacionimportante !== undefined && (
        <>
          <button className="pdfSelected" onClick={downloadPDF} type="button">
            {props.titulo}
          </button>
          <Toaster />
        </>
      )}
    </>
  );
};