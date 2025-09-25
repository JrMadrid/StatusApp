/* COMPONENTE DE ELEMENTO DE PAGINACIÓN -- DISPOSITIVOS */
import { useNavigate } from 'react-router-dom';
import ping from '../../../utils/ping.jsx';
import { HiStatusOnline, HiExternalLink } from "react-icons/hi";

const DataDispositivos = ({ user, data, listaDispositivos, eleccion, cantidad, cantidadTotal }) => {
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
              {user && user.id === 3 && (
                <th className='thData'>Ing. Responsable</th>
              )}
            </tr>
          </thead>
          <tbody >
            {data.map((item) => {
              const ipValida = !item.ip.startsWith('Sin') && !item.ip.startsWith('No');
              return (
                <tr key={item.id}>
                  <>
                    <td className="tdData">
                      {ipValida && (
                        <button onClick={() => ping(item.ip)} className="ping" ></button>
                      )}
                    </td>
                    <td className="tdData">
                      {ipValida && (
                        <a href={`https://${item.ip}`} target="_blank" rel="noreferrer" className="link select"                                            >
                          <button className="ir"></button>
                        </a>
                      )}
                    </td>
                    <td className='tdData long-data'>{item.dispositivo}</td>
                    <td className='tdData'>{item.ip}</td>
                    <td className='tdData'>{item.economico}</td>
                    <td className='tdData long-data'>{item.canal}</td>
                    <td className='tdData long-data'>{item.sucursal}</td>
                    {user && user.id === 3 && ( /* Solo para los de aplicativo */
                      <td className='tdData long-data'>{item.ingresponsable}</td>
                    )}
                  </>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className='cantidad'>Dispositivos: {cantidad} / {cantidadTotal}</p>
      </div>
      <div className='tablaLista'>
        <table>
          <thead>
            <tr>
              {listaDispositivos.map(item => (
                <th key={item.nombre} className='thLista' onClick={() => { eleccion(item.nombre); navigate('/devices'); }}>
                  <a href='/devices' onClick={() => { eleccion(item.nombre) }} className='linklista'>{item.nombre}</a>
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    </>
  );
};

export default DataDispositivos;