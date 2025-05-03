/* PANEL DE ADMINISTRACIÓN DE SUCURSALES -- VISUALIZAR */
import React, { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js'; 
import { Paginador } from '../Elements/Paginador.jsx';

const SelectSucursales = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/panel/sucursales`;
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
        let url = `http://${process.env.REACT_APP_HOST}/informe/status/numero/${economico}`;
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
            <Paginador tipo='sucursales' titulo='SUCURSALES' placeholder='Buscar por Número económico, Canal,  Nombre o ing.Responsable' data={data} eleccion={eleccion} excel='si' save='Sucursales' cantidad={count} />
        </>
    );
};

export default SelectSucursales;