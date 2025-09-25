/* PANTALLA VACIA INFORMACION PARA INFORME DE SUCURSAL */
import Pingdispo from "../../Elements/ping";
import { HiExternalLink } from "react-icons/hi"

export default function InfoAppMT(data) {
  return (
    <>
      <div className='cajaInformacionmt'>
        <div className='informacionmt'>
          <h4 className='principalmt'>Impresora</h4>
          <ul >
            {data.data.map((dispositivo, index) => (
              <>
                <li className='listItemmt'>
                  {!dispositivo.ip.startsWith('000.') && !dispositivo.ip.startsWith('001.') && dispositivo.nombre.startsWith('Laser') && (
                    <>
                      <div className='pings' style={{ fontSize: '1.5rem', paddingTop: '2px' }} >
                        <Pingdispo ip={dispositivo?.ip} />
                      </div>
                      <h4 className='principalmt' style={{ marginLeft: '1vw' }}>{dispositivo?.nombre || ""}</h4>
                      <h4 className='principalmt' style={{ marginLeft: '1vw' }}>{dispositivo?.ip || ""}</h4>
                      <div style={{ marginLeft: '1vw' }}>
                        <a href={`https://${dispositivo?.ip}`} target='_blank' rel="noreferrer" ><HiExternalLink className='externalmt' style={{ fontSize: '1.5rem' }} /></a >
                      </div>
                    </>
                  )}
                </li>
              </>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
};