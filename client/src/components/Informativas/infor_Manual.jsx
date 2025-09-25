/* COMPONENTE DE INFORMATIVA -- MANUAL */
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import fetchData from '../../api/fetchConfig.js';
import logoSoporte from '../../imgs/LogoSoporte.png';
import '../css/Infor_Sucursal.css';
import toast from 'react-hot-toast';

export default function InfoManual() {
  const [manualInfo, setManualInfo] = useState({});
  const [manualBlob, setManualBlob] = useState(null);

  // Mandar los datos del manual
  useEffect(() => {
    const manualinfo = async () => {
      try {
        const url = `http://${process.env.REACT_APP_HOST}/informe/manuales/info`;
        const response = await fetchData(url);
        const manualinfo = await response.json();
        if (!response.ok) {
          throw new Error(manualinfo.message || 'Lo sentimos, ocurrió un problema');
        }
        setManualInfo(manualinfo);
      } catch (error) {
        console.error('Error: // Mandar los datos del manual, ', error);
        toast.error(error.message || 'Error con los datos');
      }
    };

    manualinfo();
  }, []);

  // Mandar el manual
  useEffect(() => {
    const manualar = async () => {
      try {
        const url = `http://${process.env.REACT_APP_HOST}/informe/manuales/manual`;
        const response = await fetchData(url);
        if (!response) throw new Error('Sin manual');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
        }

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
        console.error('Error: // Mandar el manual, ', error);
        toast.error(error.message || 'Error con el manual');
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