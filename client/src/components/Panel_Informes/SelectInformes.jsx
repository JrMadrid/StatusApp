/* PANEL DE ADMINISTRACIÓN DE INFORMES -- VISUALIZAR */
import { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js';
import { Paginador } from '../Elements/Paginador.jsx';
import toast from 'react-hot-toast';

const SelectInformes = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    // Pedir los datos de los informes
    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/panel/informes`;
        const informes = async () => {
            try {
                const response = await fetchData(url);
                const informes = await response.json();
                if (!response.ok) {
                    throw new Error(informes.message || 'Lo sentimos, ocurrió un problema');
                }
                setData(informes);
                setCount(informes.length)
            } catch (error) {
                console.error('Error: // Pedir los datos de los informes, ', error);
                toast.error(error.message || 'Error con los datos')
            }
        };

        informes();
    }, []);

    // Pedir el informe en formato PDF
    const eleccion = async (id, nombre = 'Informe') => {
        let urle = `http://${process.env.REACT_APP_HOST}/panel/informe/${id}`;
        try {
            const response = await fetchData(urle)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
            }
            const InformeBlob = await response.blob(); // Convertir la respuesta a un Blob
            const blob = new Blob([InformeBlob], { type: 'application/pdf' }); // Crear un nuevo Blob con el tipo de contenido PDF
            const url = window.URL.createObjectURL(blob); // Crear una URL para el Blob
            const a = document.createElement('a'); // Crear un elemento <a> para descargar el archivo
            a.href = url; // Asignar la URL al atributo href del elemento <a>
            a.download = `${nombre}`;
            document.body.appendChild(a); // Añadir el elemento <a> al DOM
            a.click(); // Simular un clic en el elemento <a> para iniciar la descarga
            document.body.removeChild(a); // Eliminar el elemento <a> del DOM
            window.URL.revokeObjectURL(url); // Liberar la URL del Blob

        } catch (error) {
            console.error('Error: // Pedir el informe en formato PDF, ', error);
            toast.error(error.message || 'Error con el informe')
        }
    }

    // Pedir el id del informe
    const ver = async (id) => {
        let url = `http://${process.env.REACT_APP_HOST}/informe/informes/verinforme/${id}`;
        try {
            const response = await fetchData(url)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
            }
        } catch (error) {
            console.error('Error: // Pedir el id del informe, ', error);
            toast.error(error.message || 'Error con el informe')
        }
    }

    return (
        <>
            <Paginador tipo='informes' titulo='INFORMES' placeholder='Buscar por Económico, Canal, Sucursal, Fecha Realizada, Nombre, Descripción o Ing. Responsable' data={data} excel='si' save='Informes' cantidad={count} eleccion={eleccion} ver={ver} />
        </>
    );
};

export default SelectInformes;