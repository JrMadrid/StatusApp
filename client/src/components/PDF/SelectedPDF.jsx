/* COMPONENTE QUE GUARDA EN PDF LA INFORMACION SELECCIONADA */
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import pdfMake from 'pdfmake/build/pdfmake'; 
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
            const logoBase64 = await imgBase64(logo);
            const hnBase64 = await imgBase64(hn);
    
            const docDefinition = {
                pageSize: 'A4', 
                pageMargins: [30, 70, 30, 40], 
    
                header: {
                    margin: [0, 20, 0, 30], 
                    columns: [
                        { 
                            image: logoBase64, 
                            width: 25, 
                            margin: [30, 10, 0, 0], 
                            alignment: 'left' 
                        },
                        { 
                            text: 'Soporte Técnico Honduras', 
                            style: 'header', 
                            width: '*', 
                            alignment: 'center' 
                        },
                        { 
                            image: hnBase64, 
                            width: 40, 
                            margin: [0, 10, 20, 0], 
                            alignment: 'right' 
                        },
                    ],
                },
    
                content: [
                    { text: `${ (user.id === 4)?`Ing. ${user.username}`:''}`, style: 'subheader' },
                    { text: `${ (user.id !== 4)?`Ing. Responsable: ${props.ingresponsable}`:''}`, style: 'subheader' },
                    { text: `${props.economico || 'Economico'} ${props.sucursal || 'Sucursal'}`, style: 'subheader' },
                    { text: `${props.nombre || 'Nombre del dispositivo'} ${props.ip || 'IP del dispositivo'}`, style: 'subheader' },
                    { text: props.descripcion || 'Descripción del dispositivo.', style: 'text' },
                    { text: 'Información Importante', style: 'sectionHeader' },
                    { text: props.informacionimportante || 'Información Importante.', style: 'text' },
                    { text: props.informacionimportante2 || 'Información Importante.', style: 'text' },
                    { text: props.informacionrelevante || 'Información Relevante.', style: 'text' },
                    { text: 'Información Técnica', style: 'sectionHeader' },
                    { text: props.informaciontecnica || 'Información Técnica.', style: 'text' },
                    { text: '', pageBreak: 'after' }, 
                    { text: 'Información General', style: 'sectionHeader' },
                    { text: props.informaciongeneral || 'Información General.', style: 'text' },
                ],
                
                footer: function (currentPage, pageCount) {
                    return {
                        columns: [
                            { text: `Tipo de Reporte: ${props.titulo}`, style: 'footer1' },
                            { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center' },
                            { text: `Fecha de Generación: ${fecha}`, style: 'footer2' },
                        ],
                    };
                },
    
                styles: {
                    header: {
                        fontSize: 22,
                        bold: true,
                        margin: [0, 10, 0, 10] 
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    sectionHeader: {
                        fontSize: 12,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    text: {
                        fontSize: 12,
                        margin: [0, 0, 0, 10]
                    },
                    footer1: {
                        fontSize: 10,
                        margin: [20, 0, 0, 25],
                        alignment: 'left'
                    },
                    
                    footer2: {
                        fontSize: 10,
                        margin: [0, 0, 20, 25],
                        alignment: 'right'
                    }
                },
            };
    
            const tostada = `${props.nombre} de la ${props.economico}`;
            const guardado = `${props.nombre}_${props.economico}.pdf`;
            toast(tostada, { position: 'bottom-right' });
            pdfMake.createPdf(docDefinition).download(guardado); 
        } catch (error) {
            console.error('Error al crear el PDF:', error);
        }
    };
    

    return (
        <>
            {props && props.informacionimportante !== undefined && (
                <>
                    <button className='pdfSelected' onClick={() => { downloadPDF() }} type="button">{props.titulo}</button>
                    <Toaster />
                </>
            )}
        </>
    );
};