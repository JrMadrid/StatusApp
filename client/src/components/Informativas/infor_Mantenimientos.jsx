/* COMPONENTE DE INFORMATIVA -- MANTENIMIENTOS */
import { React, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import fetchData from '../../api/connect.js';
import { FormatearFechaTabla } from '../Elements/date.jsx';
import PDFConstancia from '../PDF/ConstanciaPDF.jsx';
import PDFConstancias from '../PDF/ConstanciasPDF.jsx';
import JPGConstancia from '../PDF/ConstanciaJPG.jsx';
import { ListExcel } from '../Listas/Lista_Excel.jsx';
import '../css/Infor_Sucursal.css';
import logoSoporte from '../../imgs/LogoSoporte.png';

export default function InfoMante() {
    const [appslist, setAppslist] = useState([]);
    const [appshead, setAppshead] = useState([]);
    const [imageBlob, setImageBlob] = useState(null);
    const [consfecha, setConsFecha] = useState('')
    const [constancias, setConstancias] = useState([]);
    const [eco, setEco] = useState('');

    useEffect(() => {
        const idGuardado = localStorage.getItem('idMantenimiento');
        if (idGuardado === 0) return;
        const seleccionado = async () => {
            try {
                const imageConstancia = document.getElementById('imageConstancia');
                imageConstancia.innerHTML = '';
                let url = `http://${process.env.REACT_APP_HOST}/informe/mantes/fecha`;
                const response = await fetchData(url);

                if (!response.ok) { throw new Error('Error al obtener la imagen: ' + response.statusText); }

                const imageBlob = await response.blob();

                if (imageBlob.size === 0) {
                    setImageBlob(null);
                    imageConstancia.innerHTML = '<h5>Sin constancia<h5/>';
                    throw new Error('La respuesta no entrega una imagen');
                }
                setImageBlob(imageBlob);
                if (!imageBlob.type.startsWith('image/')) {
                    throw new Error('La respuesta no es una imagen válida');
                }
                // Aquí ya usamos el id, ahora lo podemos borrar:
                localStorage.removeItem('idMantenimiento');

                const imageUrl = window.URL.createObjectURL(imageBlob);
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Imagen asociada al mantenimiento';
                img.style.maxWidth = '100%';

                if (imageConstancia) {
                    imageConstancia.appendChild(img);
                } else {
                    console.error('Contenedor de imagen no encontrado');
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        seleccionado();
    }, []);

    useEffect(() => {
        const fechasr = async () => {
            try {
                const url = `http://${process.env.REACT_APP_HOST}/informe/mantes/fechas`;
                const response = await fetchData(url);

                if (!response.ok) {
                    throw new Error('Sin respuesta');
                }
                const lista = await response.json();
                setEco(lista[0].economico);

                setAppslist(lista);
                setAppshead(lista[0])

            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        fechasr();
    }, []);

    useEffect(() => {
        const AllConstancias = async () => {
            try {
                const url = `http://${process.env.REACT_APP_HOST}/informe/mantes/constancias`;
                const response = await fetchData(url);
                if (response.ok) {
                    const archivos = await response.json();
                    setConstancias(archivos);
                } else {
                    console.error('No se pudieron cargar las imágenes');
                }
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        AllConstancias();
    }, []);

    const appData = async (fechasr) => {
        if (fechasr && fechasr !== null && fechasr !== 'null') {
            try {
                const imageConstancia = document.getElementById('imageConstancia');
                imageConstancia.innerHTML = '';
                const url = `http://${process.env.REACT_APP_HOST}/informe/mantes/sucursal/${fechasr}`;
                const response = await fetchData(url);

                if (!response.ok) { throw new Error('Error al obtener la imagen: ' + response.statusText); }

                const imageBlob = await response.blob();

                if (imageBlob.size === 0) {
                    setImageBlob(null);
                    setConsFecha('')
                    imageConstancia.innerHTML = '<h5>Sin constancia<h5/>';
                    throw new Error('La respuesta no entrega una imagen');
                }
                setConsFecha(fechasr)
                setImageBlob(imageBlob);
                if (!imageBlob.type.startsWith('image/')) {
                    throw new Error('La respuesta no es una imagen válida');
                }

                const imageUrl = window.URL.createObjectURL(imageBlob);

                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Imagen asociada al mantenimiento';
                img.style.maxWidth = '100%';

                if (imageConstancia) {
                    imageConstancia.appendChild(img);
                } else {
                    console.error('Contenedor de imagen no encontrado');
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        else {
            alert('Fecha no valida')
        }
    };

    return (
        <>
            <div className='sidebar'>
                <h3 className='heading'>{appshead?.ingresponsable}</h3>
                <h3 className='heading'>{appshead?.sucursal}</h3>
                <h3 className='heading'>{appshead?.economico}</h3>
                <h3 className='principal'>Mantenimientos Realizados</h3>
                <ul className='list' style={{ minHeight: '42vh', maxHeight: '42vh' }}>
                    {appslist.map((fecha, index) => (
                        <>
                            {(fecha.realizado && fecha.realizado !== null && fecha.realizado !== 'null') && (
                                <li key={index} className='listItem'>
                                    {/* <div className='ListItemA' style={{ minWidth: '12vw', maxWidth: '12vw' }} onClick={(e) => { e.preventDefault(); appData(`${fecha.realizado}`); }}> */}
                                    <div className='ListItemA' style={{ minWidth: '12vw', maxWidth: '12vw' }} onClick={(e) => { e.preventDefault(); appData(`${fecha.realizado}`); }}>
                                        <a href={`#${index}`} className='appi'><FormatearFechaTabla fecha={fecha.realizado} /></a>
                                    </div>
                                </li>
                            )}
                        </>
                    ))}
                </ul>
                <br />
                <br />
                {constancias.length !== 0 &&
                    < PDFConstancias titulo='Reporte de Constancias' eco={eco} images={constancias} />
                }
                <ListExcel data={appslist} tipo="inforMante" titulo='Lista Excel' />
                <div className='logodiv'>
                    <img src={logoSoporte} className='logo' alt="Logo de Soporte" />
                </div>
            </div >
            {imageBlob &&
                <>
                    <PDFConstancia imageBlob={imageBlob} fechaco={consfecha} eco={eco} title="Reporte de Mantenimiento" />
                    <JPGConstancia imageBlob={imageBlob} fechaco={consfecha} eco={eco} />
                </>
            }
            <div>
                <h2 className='titulo'>Soporte Técnico Honduras</h2>
                <div className='contenedorConstancia'>
                    <div className='imageConstancia' id="imageConstancia"></div>
                </div>
            </div>
            <Toaster toastOptions={{ className: 'noti' }} />
        </>
    );
};