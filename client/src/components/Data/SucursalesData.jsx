/* COMPONENTE DE TABLA DE SUCURSALES PARA APLICATIVO Y GEOGRAFIA */
import React, { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js';
import { Paginador } from '../Elements/Paginador.jsx'

const SucursalTable = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/api/sucursales`;
        const sucursales = async () => {
            try {
                const response = await fetchData(url);
                const sucursales = await response.json();
                setData(sucursales);
                setCount(sucursales.length)

            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        sucursales();
    }, []);

    const eleccion = async (economico) => {
        let url = `http://${process.env.REACT_APP_HOST}/status/numero/${economico}`;
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
            <Paginador tipo='sucursal' titulo='SUCURSALES' placeholder='Buscar por Número económico, Canal o Nombre' data={data} eleccion={eleccion} excel='si' save='Sucursales' cantidad={count} />
        </>
    );
};

export { SucursalTable };