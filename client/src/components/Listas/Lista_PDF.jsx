/* COMPONENTE DE BOTON DESCARGAR LISTA EN PDF */
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import pdfMake from 'pdfmake/build/pdfmake';
import { Toaster, toast } from 'react-hot-toast';
import date from '../../tools/date.js'
import imgBase64 from '../../tools/imgBase64.js'
import '../css/listas.css'
import logo from '../../imgs/LogoSoporteBN.png';
import hn from '../../imgs/hnBN.png';

// pdfMake.vfs = pdfFonts.pdfMake.vfs; 
function ListPDF(props) {

    const user = useContext(UserContext);
    const inge = user.username;
    const fecha = date();
    const downloadPDF = async () => {

        const logoBase64 = await imgBase64(logo);
        const hnBase64 = await imgBase64(hn);

        let tableBody;
        let cantidadColumnas = [];
        if (props.save === 'Sucursales' && user.id === 4) {
            cantidadColumnas = ['*', '*', '*']
            tableBody = [
                [
                    { text: 'Económico', style: 'tableHeader' },
                    { text: 'Canal', style: 'tableHeader' },
                    { text: 'Nombre', style: 'tableHeader' },
                ],
                ...props.data.map(item => [
                    { text: item.economico || 'Sin información' },
                    { text: item.canal || 'Sin información' },
                    { text: item.nombre || 'Sin información' },
                ])
            ];
        } else if (props.save === 'Sucursales') {
            cantidadColumnas = ['*', '*', '*', '*']
            tableBody = [
                [
                    { text: 'Económico', style: 'tableHeader' },
                    { text: 'Canal', style: 'tableHeader' },
                    { text: 'Nombre', style: 'tableHeader' },
                    { text: 'ing. Responsable', style: 'tableHeader' },
                ],
                ...props.data.map(item => [
                    { text: item.economico || 'Sin información' },
                    { text: item.canal || 'Sin información' },
                    { text: item.nombre || 'Sin información' },
                    { text: item.ingresponsable || 'Sin información' },
                ])
            ];
        } else if (props.save === 'Dispositivos' && user.id === 4) {
            cantidadColumnas = ['*', '*', '*', '*']
            tableBody = [
                [
                    { text: 'Dispositivo', style: 'tableHeader' },
                    { text: 'IP', style: 'tableHeader' },
                    { text: 'Económico', style: 'tableHeader' },
                    { text: 'Canal - Sucursal', style: 'tableHeader' },
                ],
                ...props.data.map(item => [
                    { text: item.dispositivo || 'Sin información' },
                    { text: item.ip || 'Sin información' },
                    { text: item.economico || 'Sin información' },
                    { text: `${item.canal} - ${item.sucursal}` || 'Sin información' },
                ])
            ];
        } else if (props.save === 'Dispositivos') {
            cantidadColumnas = ['*', '*', '*', '*', '*']
            tableBody = [
                [
                    { text: 'Dispositivo', style: 'tableHeader' },
                    { text: 'IP', style: 'tableHeader' },
                    { text: 'Económico', style: 'tableHeader' },
                    { text: 'Canal - Sucursal', style: 'tableHeader' },
                    { text: 'ing. Responsable', style: 'tableHeader' }
                ],
                ...props.data.map(item => [
                    { text: item.dispositivo || 'Sin información' },
                    { text: item.ip || 'Sin información' },
                    { text: item.economico || 'Sin información' },
                    { text: `${item.canal} - ${item.sucursal}` || 'Sin información' },
                    { text: item.ingresponsable || 'Sin información' },
                ])
            ];
        } else if (props.save === 'Mantenimientos' && user.id === 4) {
            cantidadColumnas = ['*', '*', '*']
            tableBody = [
                [
                    { text: 'Económico', style: 'tableHeader' },
                    { text: 'Fecha Estimada', style: 'tableHeader' },
                    { text: 'Fecha Realizado	', style: 'tableHeader' },
                ],
                ...props.data.map(item => [
                    { text: item.economico || 'Sin información' },
                    { text: item.festimada || 'Sin información' },
                    { text: item.frealizada || 'Sin información' },
                ])
            ];
        } else if (props.save === 'Mantenimientos') {
            cantidadColumnas = ['*', '*', '*', '*']
            tableBody = [
                [
                    { text: 'Económico', style: 'tableHeader' },
                    { text: 'Ing. Responsable', style: 'tableHeader' },
                    { text: 'Fecha Estimada', style: 'tableHeader' },
                    { text: 'Fecha Realizado	', style: 'tableHeader' },
                ],
                ...props.data.map(item => [
                    { text: item.economico || 'Sin información' },
                    { text: item.ingresponsable || 'Sin información' },
                    { text: item.festimada || 'Sin información' },
                    { text: item.frealizada || 'Sin información' },
                ])
            ];
        } else if (props.save === 'Informes' && user.id === 4) {
            cantidadColumnas = ['*', '*', '*']
            tableBody = [
                [
                    { text: 'Económico', style: 'tableHeader' },
                    { text: 'Canal - Sucursal', style: 'tableHeader' },
                    { text: 'Fecha Realizado', style: 'tableHeader' },
                ],
                ...props.data.map(item => [
                    { text: item.economico || 'Sin información' },
                    { text: `${item.canal} - ${item.sucursal}` || 'Sin información' },
                    { text: item.fecharealizada || 'Sin información' },
                ])
            ];
        } else if (props.save === 'Informes') {
            cantidadColumnas = ['*', '*', '*', '*']
            tableBody = [
                [
                    { text: 'Económico', style: 'tableHeader' },
                    { text: 'Canal - Sucursal', style: 'tableHeader' },
                    { text: 'Fecha Realizado', style: 'tableHeader' },
                    { text: 'Ing. Responsable', style: 'tableHeader' }
                ],
                ...props.data.map(item => [
                    { text: item.economico || 'Sin información' },
                    { text: `${item.canal} - ${item.sucursal}` || 'Sin información' },
                    { text: item.fecharealizada || 'Sin información' },
                    { text: item.ingresponsable || 'Sin información' }
                ])
            ];
        }

        const docDefinition = {
            pageSize: 'A4',
            content: [
                {
                    columns: [
                        { image: logoBase64, width: 25, margin: [0, 0, 0, 0], alignment: 'left' },
                        { text: 'Soporte Técnico Honduras', style: 'header', width: '*', alignment: 'center' },
                        { image: hnBase64, width: 40, margin: [0, 0, 0, 0], alignment: 'right' },
                    ],
                    margin: [0, 0, 0, 5]
                },
                { text: user.id === 4 ? `${props.save} asignadas al ing. ${inge}` : `${props.save}`, style: 'subheader', width: '*', alignment: 'center' },
                {
                    table: {
                        headerRows: 1,
                        widths: cantidadColumnas,
                        body: tableBody
                    },
                },
                {
                    columns: [
                        { text: `${props.save}: ${props.cantidad}`, style: 'footer1' },
                        { text: `Fecha de Generación: ${fecha}`, style: 'footer2' },
                    ],
                    margin: [0, 0, 0, 5]
                },
                { text: '', pageBreak: 'after' }
            ],
            styles: {
                header: {
                    fontSize: 20,
                    bold: true,
                    margin: [0, 0, 0, 0]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 0, 0, 0]
                },
                text: {
                    fontSize: 12,
                    margin: [0, 0, 0, 10]
                },
                tableHeader: {
                    fontSize: 12,
                    bold: true,
                    fillColor: '#f3f3f3'
                },
                footer1: {
                    fontSize: 10,
                    margin: [0, 10, 0, 0],
                    alignment: 'left'
                },
                footer2: {
                    fontSize: 10,
                    margin: [0, 10, 0, 0],
                    alignment: 'right'
                }
            },
            pageMargins: [20, 40, 20, 40]
        };
        let tostada = `No hay información`
        let guardado = `reporte.pdf`
        if (props.save === 'Dispositivos' && props.data.length !== 0) {
            guardado = user.id === 4 ? `Dispositivos-${inge}.pdf` : `Dispositivos.pdf`;
            tostada = `Dispositivos`
        }
        else if (props.save === 'Sucursales' && props.data.length !== 0) {
            guardado = user.id === 4 ? `Sucursales-${inge}.pdf` : `Sucursales.pdf`;
            tostada = `Sucursales`
        }
        else if (props.save === 'Mantenimientos' && props.data.length !== 0) {
            guardado = user.id === 4 ? `Mantenimientos-${inge}.pdf` : `Mantenimientos.pdf`;
            tostada = `Mantenimientos`
        }
        else if (props.save === 'Informes' && props.data.length !== 0) {
            guardado = user.id === 4 ? `Informes-${inge}.pdf` : `Informes.pdf`;
            tostada = `Informes`
        }
        pdfMake.createPdf(docDefinition).download(guardado);
        toast(tostada, { position: 'bottom-right' });
    }

    return (
        <>
            <button className='pdf' onClick={downloadPDF}>{props.titulo}</button>
            <Toaster />
        </>
    );
};

export { ListPDF };