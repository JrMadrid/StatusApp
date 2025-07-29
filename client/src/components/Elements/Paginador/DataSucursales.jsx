/* COMPONENTE DE ELEMENTO DE PAGINACIÓN -- SUCURSALES */
import { FaHouseUser, FaToolbox } from "react-icons/fa";

const DataSucursales = ({ user, data, eleccion, seleccion, cantidad }) => {
    return (
        <div className='cajahijo'>
            <table className='tablaData'>
                <thead>
                    <tr>
                        <th className='thData eject' title='Sucursal' ><FaHouseUser /></th>
                        <th className='thData eject' title='Mantenimientos' ><FaToolbox /></th>
                        <th className='thData'>Económico</th>
                        <th className='thData'>Canal</th>
                        <th className='thData sunombre'>Nombre</th>
                        {user && user.id === 3 && (
                            <th className='thData'>Ing. Responsable</th>
                        )}
                    </tr>
                </thead>
                <tbody >
                    {data.map(item => (
                        <>
                            {!item.economico.startsWith('000000') && (
                                <tr key={item.id}>
                                    <td className='tdData'><a href='/status' onClick={() => { eleccion(item.economico) }} className='link select'><button className='ir'></button></a></td>
                                    <td className='tdData'><a href='/mantes' onClick={() => { seleccion(item.economico, 0) }} className='link select'><button className='ir'></button></a></td>
                                    <td className='tdData'>{item.economico}</td>
                                    <td className='tdData'>{item.canal}</td>
                                    <td className='tdData long-data'>{item.nombre}</td>
                                    {user && user.id === 3 && (
                                        <td className='tdData long-data'>{item.ingresponsable}</td>
                                    )}
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
            <p className='cantidad'>Sucursales: {cantidad}</p>
        </div>
    );
};

export default DataSucursales;