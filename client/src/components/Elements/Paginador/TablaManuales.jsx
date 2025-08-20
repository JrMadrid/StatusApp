/* COMPONENTE DE ELEMENTO DE PAGINACIÓN -- MANUALES */
import { HiDocumentDownload, HiEye } from "react-icons/hi";

const TablaManuales = ({ data, eleccion, ver, cantidad, cantidadTotal }) => {
    return (
        <div className='cajahijo'>
            <table className='tablaData'>
                <thead>
                    <tr>
                        <th className='thData eject' title='Descarga directa' ><HiDocumentDownload /></th>
                        <th className='thData eject' title='Visualizar' ><HiEye /></th>
                        <th className='thData'>Nombre</th>
                        <th className='thData'>Descripción</th>
                        <th className='thData'>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td className='tdData'><button onClick={() => { eleccion(item.id, item.nombre) }} className='circuloir' ></button></td>
                            <td className='tdData'><a href='manual' onClick={() => { ver(item.id) }} className='link select'><button className='ir'></button></a></td>
                            <td className='tdData long-data' style={{ maxWidth: '30vw' }}>{item.nombre}</td>
                            <td className='tdData long-data' style={{ maxWidth: '30vw' }}>{item.descripcion}</td>
                            <td className='tdData'>{item.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className='cantidad'>Manuales: {cantidad} / {cantidadTotal}</p>
        </div>
    );
};

export default TablaManuales;