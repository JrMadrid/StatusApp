/* COMPONENTE DE BOTON DESCARGAR LISTA EN PDF */
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Toaster, toast } from 'react-hot-toast';
import date from '../../utils/date.js';
import imgBase64 from '../../utils/imgBase64.js';
import logo from '../../imgs/LogoSoporteBN.png';
import hn from '../../imgs/hnBN.png';
import '../css/listas.css';

function ListPDF(props) {
    const user = useContext(UserContext);
    const inge = user.username;
    const fecha = date();

    const downloadPDF = async () => {
        const doc = new jsPDF();
        const logoBase64 = await imgBase64(logo);
        const hnBase64 = await imgBase64(hn);
        let anchoColumna = 36;
        
        // Header con logos y título
        doc.addImage(logoBase64, 'PNG', 20, 10, 15, 0); // doc.addImage(image, 'PNG', x, y, width, height);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Soporte Técnico Honduras', 105, 20, { align: 'center' });
        doc.addImage(hnBase64, 'PNG', 170, 15, 20, 0);;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(12);
        doc.text(
            user.id === 4 ? `${props.save} asignadas al ing.${inge}` : `${props.save}`,
            doc.internal.pageSize.getWidth() / 2,
            30,
            { align: 'center' }
        );

        // Armar cabecera y cuerpo de la tabla
        let columns = [], rows = [];

        const sin = 'Sin información';
        const data = props.data;

        // Geografia -- Se omite ing.responsable ya que es el mismo
        if (props.save === 'Sucursales' && user.id === 4) {
            columns = ['Económico', 'Canal', 'Nombre'];
            rows = data.map(item => [item.economico || sin, item.canal || sin, item.nombre || sin]);
            anchoColumna = 60;
        } else if (props.save === 'Dispositivos' && user.id === 4) {
            columns = ['Dispositivo', 'IP', 'Económico', 'Canal - Sucursal'];
            rows = data.map(item => [item.dispositivo || sin, item.ip || sin, item.economico || sin, `${item.canal} - ${item.sucursal}` || sin]);
            anchoColumna = 45;
        } else if (props.save === 'Mantenimientos' && user.id === 4) {
            columns = ['Económico', 'Fecha Estimada', 'Fecha Realizado'];
            rows = data.map(item => [item.economico || sin, item.festimada || sin, item.frealizada || sin]);
            anchoColumna = 60;
        } else if (props.save === 'Informes' && user.id === 4) {
            columns = ['Económico', 'Canal - Sucursal', 'Fecha Realizado'];
            rows = data.map(item => [item.economico || sin, `${item.canal} - ${item.sucursal}` || sin, item.fecharealizada || sin]);
            anchoColumna = 60;
        } 
        // Todos los demas
        else if (props.save === 'Sucursales') {
            columns = ['Económico', 'Canal', 'Nombre', 'ing. Responsable'];
            rows = data.map(item => [item.economico || sin, item.canal || sin, item.nombre || sin, item.ingresponsable || sin]);
            anchoColumna = 45;
        } else if (props.save === 'Dispositivos') {
            columns = ['Dispositivo', 'IP', 'Económico', 'Canal - Sucursal', 'ing. Responsable'];
            rows = data.map(item => [item.dispositivo || sin, item.ip || sin, item.economico || sin, `${item.canal} - ${item.sucursal}` || sin, item.ingresponsable || sin]);
            anchoColumna = 36;
        } else if (props.save === 'Mantenimientos') {
            columns = ['Económico', 'Ing. Responsable', 'Fecha Estimada', 'Fecha Realizado'];
            rows = data.map(item => [item.economico || sin, item.ingresponsable || sin, item.festimada || sin, item.frealizada || sin]);
            anchoColumna = 45;
        } else if (props.save === 'Informes') {
            columns = ['Económico', 'Canal - Sucursal', 'Fecha Realizado', 'Ing. Responsable'];
            rows = data.map(item => [item.economico || sin, `${item.canal} - ${item.sucursal}` || sin, item.fecharealizada || sin, item.ingresponsable || sin]);
            anchoColumna = 45;
        }

        // Generar tabla
        autoTable(doc, {
            startY: 35,
            head: [columns],
            body: rows,
            styles: {
                fontSize: 9,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [120, 120, 120],
                textColor: 0,
                fontStyle: 'bold'
            },
            columnStyles: columns.reduce((acc, _, idx) => {
                acc[idx] = { cellWidth: anchoColumna };
                return acc;
            }, {}),
            tableWidth: 'auto', // puedes usar también 'wrap' si ves que se estira mucho
        });

        // Pie de página
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.text(`${props.save}: ${props.cantidad}`, 10, finalY);
        doc.text(`Fecha de Generación: ${fecha}`, doc.internal.pageSize.getWidth() - 10, finalY, { align: 'right' });

        // Nombre del archivo y notificación
        let guardado = 'reporte.pdf';
        let tostada = 'No hay información';

        if (props.save === 'Dispositivos' && data.length) {
            guardado = user.id === 4 ? `Dispositivos-${inge}.pdf` : 'Dispositivos.pdf';
            tostada = 'Dispositivos';
        } else if (props.save === 'Sucursales' && data.length) {
            guardado = user.id === 4 ? `Sucursales-${inge}.pdf` : 'Sucursales.pdf';
            tostada = 'Sucursales';
        } else if (props.save === 'Mantenimientos' && data.length) {
            guardado = user.id === 4 ? `Mantenimientos-${inge}.pdf` : 'Mantenimientos.pdf';
            tostada = 'Mantenimientos';
        } else if (props.save === 'Informes' && data.length) {
            guardado = user.id === 4 ? `Informes-${inge}.pdf` : 'Informes.pdf';
            tostada = 'Informes';
        }

        doc.save(guardado);
        toast(tostada, { position: 'bottom-right' });
    };

    return (
        <>
            <button className='pdf' onClick={downloadPDF}>{props.titulo}</button>
            <Toaster />
        </>
    );
}

export { ListPDF };