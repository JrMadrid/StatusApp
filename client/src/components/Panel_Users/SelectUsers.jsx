/* PANEL DE ADMINISTRACIÓN DE USUARIOS -- VISUALIZAR */
import { useState, useEffect } from 'react';
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

    const eleccion = async (nickname) => {
        let url = `http://${process.env.REACT_APP_HOST}/informe/users/usuario/${nickname}`;
        localStorage.setItem('nicknamePersonal', nickname); // guarda el nickname
        try {
            const response = await fetchData(url);
            if (!response.ok) {
                throw new Error("Sin respuesta");
            }
        } catch (error) {
            console.error('Error consiguiendo los datos', error);
        }
    };

    return (
        <>
            <Paginador tipo='usuarios' titulo='USUARIOS' placeholder='Buscar por Nombre o Usuario' data={data} eleccion={eleccion} cantidad={count} />
        </>
    );
};

export default SelectUsers; 