/* PANEL DE ADMINISTRACIÓN DE MANTENIMIENTOS -- VISUALIZAR */
import { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js'; 
import { Paginador } from '../Elements/Paginador.jsx';

const SelectMantenimientos = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/panel/mantenimientos`;
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

    const eleccion = async (economico, id) => {
        let url = `http://${process.env.REACT_APP_HOST}/informe/mantes/numero/${economico}/${id}`;
        localStorage.setItem('idMantenimiento', id); // guarda el ID
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
            <Paginador tipo='mantenimientos' titulo='MANTENIMIENTOS' placeholder='Buscar por Número económico, ing. Responsable o Fechas' data={data} excel='si' save='Mantenimientos' cantidad={count} eleccion={eleccion}/>
        </>
    );
};

export default SelectMantenimientos;