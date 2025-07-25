/* COMPONENTE DE INFORMATIVA -- MANUAL */
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import fetchData from '../../api/connect.js';
import logoSoporte from '../../imgs/LogoSoporte.png';
import '../css/Infor_Sucursal.css';

export default function InfoManual() {
    const [manualInfo, setManualInfo] = useState({});
    const [manualBlob, setManualBlob] = useState(null);

    useEffect(() => {
        const manualinfo = async () => {
            try {
                const url = `http://${process.env.REACT_APP_HOST}/informe/manuales/info`;
                const response = await fetchData(url);

                if (!response.ok) {
                    throw new Error('Sin respuesta');
                }
                const manualinfo = await response.json();
                setManualInfo(manualinfo[0]);
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        manualinfo();
    }, []);

    useEffect(() => {
        const manualar = async () => {
            try {
                const url = `http://${process.env.REACT_APP_HOST}/informe/manuales/manual`;
                const response = await fetchData(url);

                if (!response.ok) { throw new Error('Sin respuesta'); }

                const manualBlob = await response.blob();

                if (manualBlob.size === 0) {
                    setManualBlob(null);
                    throw new Error('La respuesta no entrega un documento');
                }
                setManualBlob(manualBlob);
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
                <h3 className="heading nombrelargo" style={{ maxHeight: "none" }}>{manualInfo.nombre}</h3>
                <div className="desccaja">
                    <p className="descman">{manualInfo.descripcion}</p>
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
                    {manualBlob ? (
                        <iframe
                            src={URL.createObjectURL(manualBlob)}
                            title="PDF Viewer"
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