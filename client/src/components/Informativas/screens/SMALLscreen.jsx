/* PANTALLA PEQUEÑA INFORMACION PARA INFORME DE SUCURSAL */
export default function InfoAppSMALL(content) {
  return (
    <>
      <div className='cajaInformacionmini'>
        <div className='informacionmini'>
          <h4 className='principalmini'>{content?.content?.nombre || ""}</h4>
          <h4 className='principalmini'> {content?.content?.ip || ""}</h4>

          <table className='tablainfomini'>
            <thead>
              <tr>
                <div className='descripcionmini'>{content?.content?.descripcion || ''}</div>
              </tr>
            </thead>
            <tbody className='informini textomini'>
              <tr>
                <td>
                  <div className='logmini' dangerouslySetInnerHTML={{ __html: content?.content?.general?.replace(/\n/g, '<br />') || '' }} />
                </td>
              </tr>
            </tbody>
            <div className="accesomini">
              <a href={`https://${content?.content?.ip}`} target='_blank' rel="noreferrer" className='appimini'><button className='irmini'>Acceso {`https://${content?.content?.ip}`}</button></a>
            </div>
          </table>
        </div>
      </div>
    </>
  )
};