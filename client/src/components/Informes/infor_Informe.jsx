/* COMPONENTE DE INFORME -- INFORMES */
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import fetchData from '../../api/connect.js';
import logoSoporte from '../../imgs/LogoSoporte.png';
import '../css/Infor_App.css';

export default function InfoInforme() {
    const [informeInfo, setInformeInfo] = useState({});
    const [informeBlob, setInformeBlob] = useState(null);

    useEffect(() => {
        const manualinfo = async () => {
            try {
                const url = `http://${process.env.REACT_APP_HOST}/informes/info`;
                const response = await fetchData(url);

                if (!response.ok) {
                    throw new Error('Sin respuesta');
                }
                const manualinfo = await response.json();
                setInformeInfo(manualinfo[0]);
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        manualinfo();
    }, []);

    useEffect(() => {
        const manualar = async () => {
            try {
                const url = `http://${process.env.REACT_APP_HOST}/informes/informe`;
                const response = await fetchData(url);

                if (!response.ok) { throw new Error('Sin respuesta'); }

                const manualBlob = await response.blob();

                if (manualBlob.size === 0) {
                    setInformeBlob(null);
                    throw new Error('La respuesta no entrega un documento');
                }
                setInformeBlob(manualBlob);
                if (!manualBlob.type.startsWith('application/pdf')) {
                    throw new Error('La respuesta no es un documento PDF válido');
                }
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        manualar();
    }, []);

    return (
        <>
            <div className="sidebar">
                <h3 className="heading nombrelargo" style={{ maxHeight: "none" }}>{informeInfo.nombre}</h3>
                <div className="desccaja">
                    <p className="descman">{informeInfo.descripcion}</p>
                </div>
                <br />
                <br />
                <div className="logodiv">
                    <img src={logoSoporte} className="logo" alt="Logo de Soporte" />
                </div>
            </div>

            <div>
                <h2 className="titulo">Soporte Técnico Honduras</h2>
                <div className="contenedorManual" >
                    {informeBlob ? (
                        <iframe
                            src={URL.createObjectURL(informeBlob)}
                            style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}
                        />
                    ) : (
                        <h5>Espere un momento...</h5>
                    )}
                </div>
            </div>

            <Toaster toastOptions={{ className: 'noti' }} />
        </>
    );
};