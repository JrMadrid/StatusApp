/* PANEL DE ADMINISTRACIÓN DE MANTENIMIENTOS -- VISUALIZAR */
import { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js';
import { Paginador } from '../Elements/Paginador.jsx';
import toast from 'react-hot-toast';

const SelectMantenimientos = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    // Pedir los datos de los mantenimientos
    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/panel/mantenimientos`;
        const mantenimientos = async () => {
            try {
                const response = await fetchData(url);
                const mantenimientos = await response.json();
                if (!response.ok) {
                    throw new Error(mantenimientos.message || 'Lo sentimos, ocurrió un problema');
                }

                setData(mantenimientos);
                setCount(mantenimientos.length)
            } catch (error) {
                console.error('Error: // Pedir los datos de los mantenimientos, ', error);
                toast.error(error.message || 'Error con los dataos')
            }
        };

        mantenimientos();
    }, []);

    // Pedir el número economico
    const eleccion = async (economico, id) => {
        let url = `http://${process.env.REACT_APP_HOST}/informe/mantes/numero/${economico}/${id}`;
        localStorage.setItem('idMantenimiento', id); // guarda el ID
        try {
            const response = await fetchData(url)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
            }
        } catch (error) {
            console.error('Error: // Pedir el número economico, ', error);
            toast.error(error.message || 'Error con el económico');
        }
    }

    return (
        <>
            <Paginador tipo='mantenimientos' titulo='MANTENIMIENTOS' placeholder='Buscar por Número económico, ing. Responsable o Fechas' data={data} excel='si' save='Mantenimientos' cantidad={count} eleccion={eleccion} />
        </>
    );
};

export default SelectMantenimientos;