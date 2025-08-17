/* COMPONENTE DE ELEMENTO DE PAGINACIÓN -- SUCURSALES */
import { /* FaStoreAlt ,*/ FaRegListAlt, FaTools } from 'react-icons/fa';

const TablaSucursales = ({ data, eleccion, seleccion, cantidad }) => {
    return (
        <div className='cajahijo'>
            <table className='tablaData'>
                <thead>
                    <tr>
                        {/* <th className='thData eject' title='Dispositivos por sucursal' ><FaStoreAlt /></th> */}
                        <th className='thData eject' title='Dispositivos por sucursal' ><FaRegListAlt /></th>
                        <th className='thData eject' title='Mantenimientos' ><FaTools /></th>
                        <th className='thData'>Económico</th>
                        <th className='thData'>Canal</th>
                        <th className='sunombre thData'>Nombre</th>
                        <th className='thData'>Ing.Responsable</th>
                        <th className='thData'>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <>
                            {!item.economico.startsWith('000000') && (
                                <tr key={item.id}>
                                    {/* <td></td> */}
                                    <td className='tdData'><a href='/status' onClick={() => { eleccion(item.economico) }} className='link select'><button className='ir'></button></a></td>
                                    <td className='tdData'><a href='/mantes' onClick={() => { seleccion(item.economico, 0) }} className='link select'><button className='ir'></button></a></td>
                                    <td className='tdData'>{item.economico}</td>
                                    <td className='tdData long-data'>{item.canal}</td>
                                    <td className='tdData long-data'>{item.nombre}</td>
                                    <td className='tdData long-data'>{item.ingresponsable}</td>
                                    <td className='tdData'>{item.id}</td>
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

export default TablaSucursales;