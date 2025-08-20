/* COMPONENTE DE ELEMENTO DE PAGINACIÓN -- INFORMES */
import { FormatearFechaTabla } from '../date.jsx';
import { HiDocumentDownload, HiEye } from "react-icons/hi";

const TablaInformes = ({ user, data, eleccion, ver, cantidad, cantidadTotal }) => {
    return (
        <div className='cajahijo'>
            <table className='tablaData'>
                <thead>
                    <tr>
                        <th className='thData eject' title='Descarga directa' ><HiDocumentDownload /></th>
                        <th className='thData eject' title='Visualizar' ><HiEye /></th>
                        <th className='thData'>Económico</th>
                        <th className='thData'>Sucursal</th>
                        <th className='thData'>Fecha Realizado</th>
                        <th className='thData'>Nombre</th>
                        {user && (user.id === 1 || user.id === 2) && (
                            <>
                                <th className='thData'>Ing.Responsable</th>
                                <th className='thData'>ID</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td className='tdData'><button onClick={() => { eleccion(item.id, item.nombre) }} className='circuloir' ></button></td>
                            <td className='tdData'><a href='informe' onClick={() => { ver(item.id) }} className='link select'><button className='ir'></button></a></td>
                            <td className='tdData'>{item.economico}</td>
                            <td className='tdData long-data'>{item.sucursal}</td>
                            <td className='tdData'><FormatearFechaTabla fecha={item.fecharealizada} /></td>
                            <td className='tdData long-data' style={{ maxWidth: '30vw' }}>{item.nombre}</td>
                            {user && (user.id === 1 || user.id === 2) && (
                                <>
                                    <td className='tdData long-data'>{item.ingresponsable}</td>
                                    <td className='tdData'>{item.id}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className='cantidad'>Informes: {cantidad} / {cantidadTotal}</p>
        </div>
    );
};

export default TablaInformes;