/* PANEL DE ADMINISTRACIÓN DE DISPOSITIVOS -- VISUALIZAR */
import { useState, useEffect } from "react";
import fetchData from '../../api/fetchConfig.js';
import { Paginador } from '../Elements/Paginador.jsx';
import toast from "react-hot-toast";

const SelectDispositivos = () => {
  const [data, setData] = useState([]);
  const [dispolist, setDispolist] = useState([]);
  const [count, setCount] = useState(0);

  // Pedir los datos de los dispositivo
  useEffect(() => {
    const url = `http://${process.env.REACT_APP_HOST}/panel/dispositivos`;
    const dispositivos = async () => {
      try {
        const response = await fetchData(url);
        const dispositivos = await response.json();
        if (!response.ok) {
          throw new Error(dispositivos.message || 'Lo sentimos, ocurrió un problema');
        }

        setCount(dispositivos.length)
        setData(dispositivos);
      } catch (error) {
        console.error('Error: // Pedir los datos de los dispositivos , ', error);
        toast.error(error.message || 'Error al cargar los dispositivos');
      }
    };

    dispositivos();
  }, []);

  // Pedir la lista de los dispositivos
  useEffect(() => {
    const url = `http://${process.env.REACT_APP_HOST}/api/dispos`;
    const dispositivoslista = async () => {
      try {
        const response = await fetchData(url);
        const listadispositivos = await response.json();
        if (!response.ok) {
          throw new Error(listadispositivos.message || 'Lo sentimos, ocurrió un problema');
        }

        setDispolist(listadispositivos);
      } catch (error) {
        console.error('Error: // Pedir la lista de los dispositivos, ', error);
        toast.error(error.message || 'Error al cargar los dispositivos');
      }
    };

    dispositivoslista();
  }, []);

  // Recibir el nombre del dispositivo
  const eleccion = async (nombre) => {
    let url = `http://${process.env.REACT_APP_HOST}/informe/devices/dispositivo/${nombre}`;
    try {
      await fetchData(url);
    } catch (error) {
      console.error('Error: // Recibir el nombre del dispositivo, ', error);
    }
  };

  return (
    <>
      <Paginador tipo='dispositivos' titulo='DISPOSITIVOS' placeholder='Buscar por Dispositivo, IP, Económico, Canal, Sucursal, Ing.Responsable' data={data} eleccion={eleccion} excel='si' save='Dispositivos' cantidad={count} listaDispositivos={dispolist} />
    </>
  )
};

export default SelectDispositivos;