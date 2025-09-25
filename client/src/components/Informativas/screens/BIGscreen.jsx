/* PANTALLA GRANDE INFORMACION PARA INFORME DE SUCURSAL */
export default function InfoAppBIG(content) {
  return (
    <>
      <div className='cajaInformacion'>
        <div className='informacion'>
          <h3 className='principal'>{content.content?.nombre || "Escoja un Dispositivo"} {content.content?.ip}</h3>
          <div className='infor descripcion' dangerouslySetInnerHTML={{ __html: content.content?.descripcion || '' }} />
          <h4 className='principal'>Información Crítica</h4>
          <div className='relevante'>
            <div className='importante'>
              <div className='importanteData' dangerouslySetInnerHTML={{ __html: content.content?.informacionimportante?.replace(/\n/g, '<br />') || '' }} />
              <div className='importanteData2' dangerouslySetInnerHTML={{ __html: content.content?.informacionimportante2?.replace(/\n/g, '<br />') || '' }} />
            </div>
            <div className='relevanteData' dangerouslySetInnerHTML={{ __html: content.content?.informacionrelevante?.replace(/\n/g, '<br />') || '' }} />
          </div>
          <div className='informaciones'>
            <div className='infor'>
              <h4 className='principal'>{content.content?.nombre === "Biometrico" ? 'Solicitudes' : 'Información Técnica'}</h4>
              <div className='texto' dangerouslySetInnerHTML={{ __html: content.content?.informaciontecnica?.replace(/\n/g, '<br />') || '' }} />
            </div>
            <div className='infor'>
              <h4 className='principal'>Información General</h4>
              <div className='texto' dangerouslySetInnerHTML={{ __html: content.content?.general?.replace(/\n/g, '<br />') || '' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};