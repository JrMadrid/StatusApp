/* PAGINA PARA URL DESCONOCIDA */
import LogoSoporte from '../imgs/LogoSoporte.png';

export default function NotFoundPage() {
    return (
        <div className='notFound' style={{textAlign: 'center', color:'rgb(255, 175, 144)'}}>
            <h1 style={{textShadow:'0px 1px black'}}>Pagina no encontrada</h1>
            <img src={LogoSoporte} alt="Logo DE Soporte Tecnico" />
        </div>
    )
};