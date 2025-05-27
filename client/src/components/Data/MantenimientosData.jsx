/* COMPONENTE DE TABLA DE MANTENIMIENTOS PARA APLICATIVO Y GEOGRAFIA */
import React, { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js';
import { Paginador } from '../Elements/Paginador.jsx'

const MantenimientoTable = () => {
    const [data, setData] = useState([]); 
    const [count, setCount] = useState(0);


    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/api/mantenimientos`;
        const mantenimientos = async () => {
            try {
                const response = await fetchData(url);
                const mantenimientos = await response.json();
                
                setData(mantenimientos);
                setCount(mantenimientos.length)

            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        mantenimientos();
    }, []);

    const eleccion = async (economico) => {
        let url = `http://${process.env.REACT_APP_HOST}/informe/mantes/numero/${economico}`;
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
            <Paginador tipo='mantenimiento' titulo='MANTENIMIENTOS' placeholder='Buscar por Número económico, ing. Responsable o Fechas' data={data} excel='si' save='Mantenimientos' eleccion={eleccion} cantidad={count} />
        </>
    );
}

export { MantenimientoTable };