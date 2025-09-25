/* PANTALLA MEDIANA INFORMACION PARA INFORME DE SUCURSAL */
import PanelBiometrico from "../Solicitudes/SolBiometrico";

export default function InfoAppMEDIUM(content) {
  return (
    <div className='cajaInformacionmedium'>
      <div className='informacionmedium'>
        <h4 className='principalmedium'>{content?.content?.nombre || ""}</h4>
        <h4 className='principalmedium'> {content?.content?.ip || ""}</h4>

        <table className='tablainfomedium'>
          <thead>
            <tr>
              <div className='descripcionmedium'>{content?.content?.descripcion || ''}</div>
            </tr>
          </thead>
          <tbody className='informedium textomedium'>
            <tr>
              <td>
                <div className='logimportante' dangerouslySetInnerHTML={{ __html: content?.content?.informacionimportante?.replace(/\n/g, '<br />') || '' }} />
              </td>
            </tr>
            <tr>
              <td>
                {(content?.content?.nombre && content?.content?.nombre === 'Biometrico') && (
                  <>
                    <div className='logmedium' >
                      <PanelBiometrico acceso={content?.content?.informacionimportante} />
                    </div>
                  </>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <div className='logmedium' dangerouslySetInnerHTML={{ __html: content?.content?.general?.replace(/\n/g, '<br />') || '' }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
};