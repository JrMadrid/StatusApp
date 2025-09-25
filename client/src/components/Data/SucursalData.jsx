/* COMPONENTE DE TABLA DE SUCURSALES PARA APLICATIVO Y GEOGRAFIA */
import { useState, useEffect } from 'react';
import fetchData from '../../api/fetchConfig.js';
import { Paginador } from '../Elements/Paginador.jsx';
import toast from 'react-hot-toast';

const SucursalTable = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  // Pedir los datos de las sucursales
  useEffect(() => {
    const url = `http://${process.env.REACT_APP_HOST}/api/sucursales`;
    const sucursales = async () => {
      try {
        const response = await fetchData(url);
        const sucursales = await response.json();
        if (!response.ok) {
          throw new Error(sucursales.message || 'Lo sentimos, ocurrió un problema');
        }

        setData(sucursales);
        setCount(sucursales.length)

      } catch (error) {
        console.error('Error // Pedir los datos de las sucursales, ', error);
        toast.error(error.message || 'Error al cargar los dispositivos');

      }
    };

    sucursales();
  }, []);

  // Pedir el número económico
  const eleccion = async (economico) => {
    let url = `http://${process.env.REACT_APP_HOST}/informe/status/numero/${economico}`;
    try {
      const response = await fetchData(url)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
      }

    } catch (error) {
      console.error('Error // Pedir el número económico, ', error);
      toast.error(error.message || 'Error al mandar el economico');
    }
  };

  // Pedir el número economico -- Mantenimiento
  const seleccion = async (economico, id) => {
    let url = `http://${process.env.REACT_APP_HOST}/informe/mantes/numero/${economico}/${id}`;
    localStorage.setItem('idMantenimiento', id); // guarda el ID
    try {
      const response = await fetchData(url)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
      }

    } catch (error) {
      console.error('Error // Pide el número economico, ', error);
      toast.error(error.message || 'Error al mandar el economico');

    }
  };

  return (
    <>
      <Paginador tipo='sucursal' titulo='SUCURSALES' placeholder='Buscar por Número económico, Canal o Nombre' data={data} eleccion={eleccion} seleccion={seleccion} excel='si' save='Sucursales' cantidad={count} />
    </>
  );
};

export { SucursalTable };