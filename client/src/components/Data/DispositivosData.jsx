/* COMPONENTE DE TABLA DE DISPOSITIVOS PARA APLICATIVO Y GEOGRAFIA */
import { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js';
import { Paginador } from '../Elements/Paginador.jsx';

const DispositivoTable = () => {
    const [data, setData] = useState([]);
    const [dispolist, setDispolist] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/api/dispositivos`;
        const aplicaciones = async () => {
            try {
                const response = await fetchData(url); 
                const aplicaciones = await response.json();
                setData(aplicaciones);
                setCount(aplicaciones.length)

            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        aplicaciones();
    }, []);

    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/api/dispos`;
        const dispositivoslista = async () => {
            try {
                const response = await fetchData(url);
                const listadispositivos = await response.json();

                setDispolist(listadispositivos);
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        dispositivoslista();
    }, []);

    const eleccion = async (nombre) => {
        let url = `http://${process.env.REACT_APP_HOST}/informe/devices/dispositivo/${nombre} `;
        try {
            const response = await fetchData(url)

            if (!response.ok) {
                throw new Error('Sin respuesta')
            }
        } catch (error) {
            console.error('Error consiguiendo los datos: ', error);
        }
    }

    return (
        <>
            <Paginador tipo='dispositivo' titulo='DISPOSITIVOS' placeholder='Buscar por Dispositivo, IP, Económico, Canal, o Sucursal' data={data} eleccion={eleccion} excel='si' save='Dispositivos' cantidad={count} listaDispositivos={dispolist} />
        </>
    );
};

export { DispositivoTable };