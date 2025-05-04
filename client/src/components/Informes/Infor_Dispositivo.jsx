/* COMPONENTE DE INFORME -- DISPOSITIVOS */
import { React, useEffect, useState } from 'react';
import fetchData from '../../api/connect.js';
import Pingdispo from '../Elements/ping.jsx';
import ALLPDF from '../PDF/AllPDF.jsx'
import { ListExcel } from '../Listas/Lista_Excel.jsx';
import '../css/Infor_Device.css';
import logoSoporte from '../../imgs/LogoSoporte.png';
import { HiExternalLink, HiFastForward } from "react-icons/hi";

export default function InfoDispositivo() {
    const [appslist, setAppslist] = useState([]);
    const [content, setContent] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const dispositivos = async () => {
            try {
                const url = `http://${process.env.REACT_APP_HOST}/informe/devices/dispositivos`;
                const response = await fetchData(url);

                if (!response.ok) {
                    throw new Error('Sin respuesta');
                }
                const lista = await response.json();
                setAppslist(lista);
                if (lista.length > 0) {
                    appData(lista[0].nombre);
                }
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        dispositivos();
    }, []);

    const appData = async (dispo) => {
        try {
            const response = await fetchData(`http://${process.env.REACT_APP_HOST}/informe/devices/device/${dispo}`);
            if (!response.ok) {
                throw new Error('Sin respuesta');
            }
            const info = await response.json();
            setData(info);
            setContent(info);
        } catch (error) {
            console.error('Error consiguiendo los datos: ', error);
            setContent([]);
        }
    };

    return (
        <>
            <div className='sidebar2'>
                <h3 className='heading2'>Sucursales</h3>
                <ul className='list2'>
                    {appslist.map((dispositivo, index) => (
                        <li className='listaElement' key={index} >
                            <a href={`#${dispositivo.economico}`} className={`listItem2 appi2 ${dispositivo?.ip.startsWith('000.') || dispositivo?.ip.startsWith('001.') ? 'sinip2' : ''}`} >
                                <HiFastForward  style={{fontSize:'0.5rem'}}/>
                                {dispositivo.economico}-{dispositivo.sucursal}
                            </a>
                        </li>
                    ))}
                </ul>
                <br />
                <ALLPDF titulo='Reporte de los Dispositivos' guardado='devices' data={data} />
                <ListExcel data={appslist} tipo="inforDevice" titulo='Lista Excel' style={{ bottom: '20vh' }} />
                <div className='logodiv2'>
                    <img src={logoSoporte} className='logo2' alt="Logo de Soporte" />
                </div>
            </div>

            <div>
                <h2 className='titulo2'>Soporte Técnico Honduras</h2>
                <div className='cajaInformacion2'>
                    <h3 className='principal2' style={{maxWidth:'79.5vw'}}>{data[0]?.nombre || ""}</h3>
                    <div className='informacion2'>
                        <br />
                        <table className='tablainfo2'>
                            <thead>
                                <tr>
                                    {content.map((dispositivo, index) => (
                                        <th className='principal2' key={index}>
                                            <section id={`${dispositivo.economico}`}>
                                                <div className='itemName'>{dispositivo.economico}-{dispositivo.sucursal}</div>
                                                <span className='appi iteming'>{dispositivo.ingresponsable}</span>
                                                {!dispositivo.ip.startsWith('000.') && !dispositivo.ip.startsWith('001.') && (
                                                    <div className='grupo2'>
                                                        <span className='appi2listPing'><Pingdispo ip={dispositivo?.ip} /></span>
                                                        <span className='appi2list'>
                                                            {(dispositivo?.ip.startsWith('000.')) ? 'Sin inventario' : (dispositivo?.ip.startsWith('001.')) ? 'No aplica' : dispositivo?.ip}
                                                        </span>
                                                        <a className='appi2listExte' href={`https://${dispositivo?.ip}`} target='_blank' rel="noreferrer">
                                                            <HiExternalLink />
                                                        </a>
                                                    </div>
                                                )}
                                                {dispositivo.ip.startsWith('000.') && (
                                                    <div>
                                                        <span className='appi2list' style={{ color: 'rgb(223,97,97)' }}>
                                                            Sin inventario
                                                        </span>
                                                    </div>
                                                )}
                                                {dispositivo.ip.startsWith('001.') && (
                                                    <div>
                                                        <span className='appi2list' style={{ color: 'rgb(223,97,97)' }}>
                                                            No aplica
                                                        </span>
                                                    </div>
                                                )}
                                            </section>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {content.map((dispositivo, index) => (
                                        <td className='infor2 texto2' key={index}>
                                            <section className="descripcion-section">
                                                <div className='descripcion2'>{dispositivo?.descripcion || ''}</div>
                                                <div className='log2' dangerouslySetInnerHTML={{ __html: dispositivo?.general?.replace(/\n/g, '<br />') || '' }} />
                                            </section>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};