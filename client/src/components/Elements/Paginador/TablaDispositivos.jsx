/* COMPONENTE DE ELEMENTO DE PAGINACIÓN -- DISPOSITIVOS */
import { useNavigate } from 'react-router-dom';
import ping from '../../../utils/ping.jsx';
import { HiStatusOnline, HiExternalLink } from 'react-icons/hi';

const TablaDispositivos = ({ data, eleccion, listaDispositivos, cantidad }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className='cajahijo'>
                <table className='tablaData'>
                    <thead>
                        <tr>
                            <th className='thData pingi' title='Ping' ><HiStatusOnline /></th>
                            <th className='thData pingi' title='Ir' ><HiExternalLink /></th>
                            <th className='thData'>Dispositivo</th>
                            <th className='thData'>IP</th>
                            <th className='thData'>Económico</th>
                            <th className='thData'>Canal</th>
                            <th className='sunombre thData'>Sucursal</th>
                            <th className='thData'>ing.Responsable</th>
                            <th className='thData'>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id}>
                                <td className='tdData'>
                                    {!item.ip.startsWith('Sin') && !item.ip.startsWith('No') && (
                                        <button onClick={() => { ping(item.ip) }} className='ping'></button>
                                    )}
                                </td>
                                <td className='tdData'>
                                    {!item.ip.startsWith('Sin') && !item.ip.startsWith('No') && (
                                        <a href={`https://${item.ip}`} target='_blank' rel="noreferrer" className='link select'><button className='ir'></button></a>
                                    )}
                                </td>
                                <td className='tdData long-data'>{item.dispositivo}</td>
                                <td className='tdData'>{item.ip}</td>
                                <td className='tdData'>{item.economico}</td>
                                <td className='tdData long-data'>{item.canal}</td>
                                <td className='tdData long-data'>{item.sucursal}</td>
                                <td className='tdData long-data'>{item.ingresponsable}</td>
                                <td className='tdData'>{item.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className='cantidad'>Dispositivos: {cantidad}</p>
            </div>
            <div className='tablaLista'>
                <table>
                    <thead>
                        <tr>
                            {listaDispositivos.map(item => (
                                <>
                                    <th className='thLista' onClick={() => { eleccion(item.nombre); navigate('/devices'); }}>
                                        <a href='/devices' onClick={() => { eleccion(item.nombre) }} className='linklista'>{item.nombre}</a>
                                    </th>
                                </>
                            ))}
                        </tr>
                    </thead>
                </table>
            </div>
        </>
    );
};

export default TablaDispositivos;