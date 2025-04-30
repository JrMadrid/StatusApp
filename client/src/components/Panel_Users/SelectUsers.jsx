/* PANEL DE ADMINISTRACIÓN DE USUARIOS -- VISUALIZAR */
import React, { useState, useEffect } from 'react';
import fetchData from '../../api/connect.js';
import { Paginador } from '../Elements/Paginador.jsx';

const SelectUsers = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/panel/users`;
        const usuarios = async () => {
            try {
                const response = await fetchData(url);
                const jsonData = await response.json();
                setData(jsonData);
                setCount(jsonData.length)

            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        usuarios();
    }, []);

    return (
        <>
            <Paginador tipo='usuarios' titulo='USUARIOS' placeholder='Buscar por Nombre o Usuario' data={data} cantidad={count} />
        </>
    );
};

export default SelectUsers; 