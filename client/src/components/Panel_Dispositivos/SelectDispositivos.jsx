/* PANEL DE ADMINISTRACIÓN DE DISPOSITIVOS -- VISUALIZAR */
import React, { useState, useEffect } from "react";
import fetchData from '../../api/connect.js'; 
import { Paginador } from '../Elements/Paginador.jsx';

const SelectDispositivos = () => {
    const [data, setData] = useState([]);
    const [dispolist, setDispolist] = useState([]); 
    const [count, setCount] = useState(0);

    useEffect(() => {
        const url = `http://${process.env.REACT_APP_HOST}/panel/dispositivos`;
        const dispositivos = async () => {
            try {
                const response = await fetchData(url);
                const dispositivos = await response.json();
                setCount(dispositivos.length)
                setData(dispositivos);

            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        dispositivos();
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
        let url = `http://${process.env.REACT_APP_HOST}/informe/devices/dispositivo/${nombre}`;
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
            <Paginador tipo='dispositivos' titulo='DISPOSITIVOS' placeholder='Buscar por Dispositivo, IP, Económico, Canal, Sucursal, Ing.Responsable' data={data} eleccion={eleccion} excel='si' save='Dispositivos' cantidad={count} listaDispositivos={dispolist} />
        </>
    )
};

export default SelectDispositivos;