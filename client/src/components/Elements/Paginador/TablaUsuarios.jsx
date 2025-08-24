/* COMPONENTE DE ELEMENTO DE PAGINACIÓN -- USUARIOS */
import { FaAddressCard } from "react-icons/fa";

const TablaUsuarios = ({ data, eleccion, cantidad, cantidadTotal }) => {
    return (
        <div className='cajahijo'>
            <table className='tablaData'>
                <thead>
                    <tr>
                        <th className='thData eject' title='Usuario' ><FaAddressCard /></th>
                        <th className='thData'>Nombre</th>
                        <th className='sunombre thData'>Contraseña</th>
                        <th className='sunombre thData'>Usuario</th>
                        <th className='thData'>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td className='tdData'>
                                <a href='/users' onClick={() => eleccion(item.nickname)} className='link select'>
                                    <button className='ir'></button>
                                </a>
                            </td>
                            <td className='tdData long-data'>{item.nickname}</td>
                            <td className='tdData long-data' style={{ overflowX: 'hidden' }}>{item.psw}</td>
                            <td className='tdData'>{item.tipo}</td>
                            <td className='tdData'>{item.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className='cantidad'>Usuarios: {cantidad} / {cantidadTotal}</p>
        </div>
    );
};

export default TablaUsuarios;