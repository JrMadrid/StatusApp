/* COMPONENTE DE INFORMATIVA -- SUCURSAL */
import { useEffect, useState } from 'react';
import Pingdispo from '../Elements/ping.jsx';
import { Toaster, toast } from 'react-hot-toast';
import fetchData from '../../api/connect.js';
import SelectedPDF from '../PDF/SelectedPDF.jsx';
import ALLPDF from '../PDF/AllPDF.jsx';
import { ListExcel } from '../Listas/Lista_Excel.jsx';
import InfoAppBIG from './screens/BIGscreen.jsx';
import InfoAppMEDIUM from './screens/MEDIUMscreen.jsx';
import InfoAppSMALL from './screens/SMALLscreen.jsx';
import InfoAppMT from './screens/MTscreen.jsx';
import '../css/Infor_Sucursal.css';
import { HiExternalLink } from "react-icons/hi";
import logoSoporte from '../../imgs/LogoSoporte.png';

export default function InfoSucursal() {
	const [impre, SetImpre] = useState(false);
	const [dispositivoIp, SetDispositivoIp] = useState('');
	const [impreE, SetImpreE] = useState(false);
	const [appslist, setAppslist] = useState([]);
	const [appshead, setAppshead] = useState([]);
	const [content, setContent] = useState('');
	const [data, setData] = useState([]);

	// Consultar y retornar los dispositivos registrados por número económico
	useEffect(() => {
		const aplicaciones = async () => {
			try {
				const url = `http://${process.env.REACT_APP_HOST}/informe/status/aplicaciones`;
				const response = await fetchData(url);
				const lista = await response.json();
				if (!response.ok) { throw new Error(lista.message || 'Lo sentimos, ocurrió un problema'); }
				if (!lista.length) { throw new Error("Sin dispositivos asignados"); }

				// Función para contar dispositivos válidos
				const contarDispositivosValidos = (lista) => {
					return lista.filter(
						(dispositivo) =>
							!dispositivo.ip.startsWith("000.") && !dispositivo.ip.startsWith("001.")
					).length;
				};

				setAppslist(lista);
				setAppshead(lista[0])

				if (contarDispositivosValidos(lista) === 0) { throw new Error("Sin dispositivos validos"); }

			} catch (error) {
				console.error('Error // Consultar y retornar los dispositivos registrados por número económico, ', error);
				toast.error(error.message || 'Error al cargar los dispositivos');
			}
		};

		aplicaciones();
	}, []);

	// Verificar si es una impresa para elistar
	useEffect(() => {
		const checkImpresoras = () => {
			let hayImpresoras = false;

			for (let i = 0; i < appslist.length; i++) {
				if (appslist[i].nombre.startsWith('Laser') && !appslist[i].ip.startsWith('000.') && !appslist[i].ip.startsWith('001.')) {
					hayImpresoras = true;
					break;
				}
			}
			SetImpreE(hayImpresoras);
		};
		if (appslist.length > 0) {
			checkImpresoras();
		}
	}, [appslist]);

	// Obtener la información general de un dispositivo en específico por su IP
	const appData = async (ip) => {
		SetDispositivoIp(ip);
		return toast.promise(
			fetchData(`http://${process.env.REACT_APP_HOST}/informe/status/aplicacion/${ip}`).then(response => {
				const Data = response.json();
				if (!response.ok) {
					throw new Error(Data.message || 'Lo sentimos, ocurrió un problema');
				}
				return Data;
			}),
			{
				loading: 'Cargando datos',
				success: (datos) => {
					setContent(datos[0]);

					return <b>¡Datos cargados!</b>;
				},
				error: (error) => {
					console.error('Error // Obtener la información general de un dispositivo en específico por su IP, ', error);
					toast.error(error.message || 'Error al cargar la información del dispositivo');
					setContent('Error al cargar el contenido');
					return <b>¡Ocurrió un error!</b>;
				}
			}
		);
	};

	// Recorrer los dispositivos de una sucursal y actualizar la información si es necesario
	useEffect(() => {
		const dispositivos = async () => {
			try {
				const url = `http://${process.env.REACT_APP_HOST}/informe/status/dispositivos`;
				const response = await fetchData(url);
				const todos = await response.json();
				if (!response.ok) {
					throw new Error(todos.message || 'Lo sentimos, ocurrió un problema');
				}

				setData(todos)
			} catch (error) {
				console.error('Error // Recorrer los dispositivos de una sucursal y actualizar la información si es necesario, ', error);
				toast.error(error.message || 'Error al cargar los datos');
			}
		};

		dispositivos();
	}, []);

	return (
		<>
			<div className='sidebar'>
				<h3 className='heading'>{appshead?.ingresponsable}</h3>
				<h3 className='heading'>{appshead?.sucursal}</h3>
				<h3 className='heading'>{appshead?.economico}</h3>
				<h3 className='principal'>Dispositivos</h3>
				<ul className='list'>
					{appslist.map((dispositivo, index) => (
						<>
							{!dispositivo.ip.startsWith('000.') && !dispositivo.ip.startsWith('001.') && !dispositivo.nombre.startsWith('Laser') && (
								<>
									<li key={index} className='listItem'>
										<div className='pings'>
											<Pingdispo ip={dispositivo.ip} />
										</div>
										<div className={dispositivo.ip !== dispositivoIp ? 'ListItemA' : 'seleccionado'} onClick={(e) => { e.preventDefault(); appData(`${dispositivo.ip}`); SetImpre(false) }}>
											<a href={`#${index}`} className={dispositivo.ip !== dispositivoIp ? 'appi' : 'appiSeleccionado'}>{(dispositivo.ip.startsWith('000.') || dispositivo.ip.startsWith('001.')) ? '' : dispositivo.nombre}</a>
										</div>
										<div className='pings'>
											<a className='appi2listExte' href={`https://${dispositivo?.ip}`} target='_blank' rel="noreferrer" ><HiExternalLink style={{ paddingTop: ' 0.1rem' }} /></a>
										</div>
									</li>
								</>
							)}
						</>
					))}
					{impreE === true && (
						<>
							<li className='listItem'>
								<div className='pings'>
								</div>
								<div className='ListItemA' onClick={(e) => { SetImpre(true) }}>
									<span className='appi'>Impresora</span>
								</div>
							</li>
						</>
					)}
				</ul>
				<br />
				<br />
				<ALLPDF titulo='Reporte de la Sucursal' guardado='apps' data={data} />
				<ListExcel data={appslist} tipo="inforApps" titulo='Lista Excel' />
				<div className='logodiv'>
					<img src={logoSoporte} className='logo' alt="Logo de Soporte" />
				</div>
			</div >
			{(content?.nombre && content?.nombre === 'UPS') && (
				<>
					<SelectedPDF titulo='Reporte del Dispositivo' ingresponsable={content?.ingresponsable} economico={content?.economico} sucursal={content?.sucursal} nombre={content?.nombre} ip={content?.ip} descripcion={content?.descripcion} informacionimportante={content?.informacionimportante} informacionimportante2={content?.informacionimportante2} informacionrelevante={content?.informacionrelevante} informaciontecnica={content?.informaciontecnica} informaciongeneral={content?.general} />
				</>
			)}
			<div>
				<h2 className='titulo'>Soporte Técnico Honduras</h2>
				{(content?.ip && content?.nombre && (content?.nombre === 'Biometrico' || content?.nombre === 'UPS')) && impre === false && (
					<>
						<a href={`https://${content?.ip}`} target='_blank' rel="noreferrer" className='appi'><button className='ir'>Acceso {`https://${content?.ip}`}</button></a>
					</>
				)}
				{(content?.nombre && content?.nombre === 'UPS') && impre === false && (
					<>
						<InfoAppBIG content={content} />
					</>
				)}
				{(content?.nombre && content?.nombre === 'Biometrico') && impre === false && (
					<>
						<InfoAppMEDIUM content={content} />
					</>
				)}
				{(content?.nombre && (content?.nombre !== 'UPS' && content?.nombre !== 'Biometrico') && impre === false) && (
					<>
						<InfoAppSMALL content={content} />
					</>
				)}
				{(impre === true) && (
					<>
						<InfoAppMT data={appslist} />
					</>
				)}
			</div>
			<Toaster toastOptions={{ className: 'noti' }} />
		</>
	);
};