/* COMPONENTE DE INFORMATIVA -- USUARIO */
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Toaster, toast } from 'react-hot-toast';
import fetchData from '../../api/connect';
import axios from '../../api/axiosConfig';
import fechaFomatoSQL from '../../utils/formatoFecha.js';
import calcularEdad from '../../utils/edad.js';
import '../css/Infor_Sucursal.css';
import { FaRegEdit, FaCheck, FaTimes, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import logoSoporte from '../../imgs/LogoSoporte.png';
import profile from '../../imgs/profile.png';

export default function InfoUsuario() {
	const user = useContext(UserContext);

	const [userslist, setUserslist] = useState([]);
	const [nicknameGuardado, setNicknameGuardado] = useState('');
	const [userDatosSeleccionado, setUserDatosSeleccionado] = useState({});
	const [userFotoSeleccionado, setUserFotoSeleccionado] = useState(null);
	const [imagenPerfil, setImagenPerfil] = useState(profile);
	const [edad, setEdad] = useState(0);
	const [editar, setEditar] = useState(null);
	const [valorTemporal, setValorTemporal] = useState('');

	// Pedir la lista de usuarios
	useEffect(() => {
		if (user.id === 1) {
			const listaUsuarios = async () => {
				try {
					const url = `http://${process.env.REACT_APP_HOST}/informe/users/lista/nombres`;
					const response = await fetchData(url);
					const lista = await response.json();
					if (!response.ok) {
						throw new Error(lista.message || 'Lo sentimos, ocurrió un problema');
					}
					setUserslist(lista);
				} catch (error) {
					console.error(' Error: // Pedir la lista de usuarios, ', error);
					toast.error(error.message || 'Error con la lista del personal');
				}
			};
			listaUsuarios();
		};
	}, []);

	// Pedir los datos del personal seleccionado
	useEffect(() => {
		const nickGuardado = localStorage.getItem('nicknamePersonal');
		setNicknameGuardado(nickGuardado);
		const DatosSeleccionado = async () => {
			try {
				const url = `http://${process.env.REACT_APP_HOST}/informe/users/datos/usuario`;
				const response = await fetchData(url);
				const seleccionado = await response.json();
				if (!response.ok) {
					throw new Error(seleccionado.message || 'Lo sentimos, ocurrió un problema');
				}
				setUserDatosSeleccionado(seleccionado);
				setEdad(calcularEdad(seleccionado?.fecha_nacimiento));
				// localStorage.removeItem('nicknamePersonal');
			} catch (error) {
				console.error('Error: // Pedir los datos del personal seleccionado, ', error);
				toast.error(error.message || 'Error con los datos del personal');
			}
		};
		DatosSeleccionado();
	}, []);

	// Pedir la foto del personal seleccionado
	useEffect(() => {
		const nickGuardado = localStorage.getItem('nicknamePersonal');
		setNicknameGuardado(nickGuardado);

		const FotoSeleccionado = async () => {
			try {
				const url = `http://${process.env.REACT_APP_HOST}/informe/users/foto/usuario`;
				const response = await fetchData(url);
				if (!response) throw new Error('Sin foto');
				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
				}

				const imageBlob = await response.blob();
				if (imageBlob.size === 0) throw new Error('La respuesta no entrega una imagen');
				if (!imageBlob.type.startsWith('image/')) throw new Error('La respuesta no es una imagen válida');

				const imageUrl = window.URL.createObjectURL(imageBlob);
				setImagenPerfil(imageUrl)
				// localStorage.removeItem('nicknamePersonal');
			} catch (error) {
				console.error('Error: // Pedir la foto del personal seleccionado, ', error);
				toast.error(error.message || 'Error la foto del personal');
			}
		};

		FotoSeleccionado();

		// Opcional: limpieza del URL creado para liberar memoria cuando el componente se desmonte o imagenPerfil cambie
		// return () => {
		//     if (imagenPerfil) {
		//         window.URL.revokeObjectURL(imagenPerfil);
		//     }
		// };
	}, []);

	// Pedir los datos del personal seleccionado en seleccion
	const seleccion = async (nickname) => {
		setEditar(null);
		let url = `http://${process.env.REACT_APP_HOST}/informe/users/datos/seleccion/${nickname}`;
		try {
			const response = await fetchData(url);
			const seleccionado = await response.json();
			if (!response.ok) {
				throw new Error(seleccionado.message || 'Lo sentimos, ocurrió un problema');
			}
			setEdad(calcularEdad(seleccionado?.fecha_nacimiento))
			setUserDatosSeleccionado(seleccionado);
		} catch (error) {
			console.error('Error: // Pedir los datos del personal seleccionado en seleccion, ', error);
			toast.error(error.message || 'Error con los datos del personal');
		}
	};

	// Pedir la foto del personal seleccionado en seleccion
	const seleccionFoto = async (nickname) => {
		setUserFotoSeleccionado(null);
		setImagenPerfil(profile);
		try {
			const url = `http://${process.env.REACT_APP_HOST}/informe/users/foto/seleccion/${nickname}`;
			const response = await fetchData(url);
			if (!response) throw new Error('Sin foto');
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Lo sentimos, ocurrió un problema');
			}

			const imageBlob = await response.blob();

			if (imageBlob.size === 0) throw new Error('La respuesta no entrega una imagen');
			if (!imageBlob.type.startsWith('image/')) throw new Error('La respuesta no es una imagen válida');

			const imageUrl = window.URL.createObjectURL(imageBlob);
			setImagenPerfil(imageUrl)
		} catch (error) {
			console.error('Error: // Pedir la foto del personal seleccionado en seleccion, ', error);
			toast.error(error.message || 'Error con la foto del personal');
		}
	};

	const ediccion = (propiedad) => {
		if (!propiedad) return;
		setEditar(propiedad);
		setValorTemporal(userDatosSeleccionado?.[propiedad] || '');
	};

	const cancelarEdicion = () => {
		setEditar(null);
		setValorTemporal('');
	};

	// Editar los datos del personal
	const guardarCambio = async () => {
		if (!editar) return;
		const campo = editar;
		setEditar(null);

		if (campo === 'foto') {
			await subirFoto(valorTemporal); // función separada solo para foto
			return;
		}

		const url = `http://${process.env.REACT_APP_HOST}/informe/users/datos/guardar/${campo}`;
		try {
			const response = await axios.post(url, {
				valor: valorTemporal,
				id: userDatosSeleccionado.id
			});
			if (campo === 'fecha_nacimiento') {
				setEdad(calcularEdad(valorTemporal));
			}
			setUserDatosSeleccionado(prev => ({
				...prev,
				[campo]: valorTemporal,
			}));

			toast.success(response?.data?.message || 'Cambio guardado');
		} catch (error) {
			console.error('Error: // Editar los datos del personal, ', error);
			toast.error(error.response?.data?.message || 'Error al guardar el cambio');
		}
	};

	// Editar la foto del personal
	const subirFoto = async (archivo) => {
		if (!archivo) {
			toast.error("Ningún archivo seleccionado.");
			return;
		}

		const tiposPermitidos = ["image/png", "image/jpeg"];
		const maxSizeMB = 2;

		if (!tiposPermitidos.includes(archivo.type)) {
			toast.error("Solo se permiten imágenes PNG o JPG.");
			return;
		}

		if (archivo.size > maxSizeMB * 3000 * 3000) {
			toast.error(`La imagen no debe pesar más de ${maxSizeMB}MB.`);
			return;
		}

		const formData = new FormData();
		formData.append("foto", archivo);
		formData.append("id", userDatosSeleccionado.id);

		// Actualizar solo la imagen mostrada
		setUserFotoSeleccionado(prev => ({
			...prev,
			foto: URL.createObjectURL(archivo),
		}));

		try {
			await axios.post(`http://${process.env.REACT_APP_HOST}/informe/users/guardar/foto`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			toast.success("Foto actualizada correctamente");
		} catch (error) {
			console.error('Error: // Editar la foto del personal, ', error);
			toast.error(error.response?.data?.message || "Error al subir la foto");
		}
	};

	const renderInput = (campo) => {
		switch (campo) {
			case 'cedula':
				return <input style={{ height: '0.5rem' }} value={valorTemporal} onChange={(e) => setValorTemporal(e.target.value)} pattern="\d{4}-\d{4}-\d{5}" placeholder="1234-5678-90123" maxLength={15} autoFocus />;
			case 'localidad':
			case 'grado_academico':
			case 'puesto':
				return <input style={{ height: '0.5rem' }} value={valorTemporal} onChange={(e) => setValorTemporal(e.target.value)} maxLength={100} autoFocus />;
			case 'nombre':
				return <input style={{ height: '0.5rem' }} value={valorTemporal} onChange={(e) => setValorTemporal(e.target.value)} maxLength={200} autoFocus />;
			case 'telefono':
				return <input style={{ height: '0.5rem' }} value={valorTemporal} onChange={(e) => setValorTemporal(e.target.value)} maxLength={20} autoFocus />;
			case 'descripcion':
				return <textarea value={valorTemporal} style={{ width: '100%', height: '12rem' }} onChange={(e) => setValorTemporal(e.target.value)} maxLength={3000} rows={4} autoFocus />;
			case 'fecha_nacimiento':
			case 'fecha_contratacion':
				return <input style={{ height: '0.5rem' }} type="date" max={new Date().toISOString().split('T')[0]} value={valorTemporal} onChange={(e) => setValorTemporal(e.target.value)} autoFocus />;
			case 'sexo':
				return (
					<select value={valorTemporal} onChange={(e) => setValorTemporal(e.target.value)} autoFocus>
						<option value="">Seleccionar</option>
						<option value="M">Masculino</option>
						<option value="F">Femenino</option>
					</select>
				);
			case 'activo':
				return (
					<select value={valorTemporal ? 'true' : 'false'} onChange={(e) => setValorTemporal(e.target.value === 'true')} autoFocus                  >
						<option value="true">Activo</option>
						<option value="false">Inactivo</option>
					</select>
				);
			case 'foto':
				return (
					<>
						<label htmlFor="fotoperfil" className='subirFotoPerfil'>Subir Foto</label>
						<input id="fotoperfil" type="file" accept=".png, .jpg, .jpeg" onChange={(e) => setValorTemporal(e.target.files[0])} autoFocus style={{ display: 'none' }} />
					</>
				);
			default:
				return <input value={valorTemporal} onChange={(e) => setValorTemporal(e.target.value)} autoFocus />;
		}
	};

	const renderCampo = (campo, label) => {
		const valorActual = userDatosSeleccionado?.[campo];
		let contenido = valorActual;

		if (campo === 'activo') {
			contenido = valorActual ? <><FaUserCheck className='activoono' style={{ color: 'green' }} /> </> : <><FaUserTimes className='activoono' style={{ color: 'red' }} /> </>;
		} else if (campo.includes('fecha') && valorActual) {
			contenido = fechaFomatoSQL(valorActual);
		}
		else if (valorActual && campo === 'sexo') {
			contenido = (valorActual === 'F') ? 'Femenino' : 'Masculino';
		}
		return (
			<h5 className={`datosPersonal campo-${campo}`}>
				<span className='datosTipo'>
					{campo === 'foto' ? (
						<>
							<FaRegEdit className='editIcon' onClick={() => ediccion(campo)} />
						</>
					) : (
						<>
							<FaRegEdit className='editIcon' onClick={() => ediccion(campo)} />
							{` ${label}`}:{' '}
						</>
					)}
				</span>
				{editar === campo ? (
					<span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
						{renderInput(campo)}
						<button onClick={guardarCambio} className='btnConfirmar'>
							<FaCheck />
						</button>
						<button onClick={cancelarEdicion} className='btnCancelar'>
							<FaTimes />
						</button>
					</span>
				) : (
					<>
						{campo === 'foto' ? (
							<span></span>
						) : (
							<span>{contenido || `Sin registrar`}</span>
						)}
					</>
				)}
			</h5>
		);
	};

	return (
		<>
			<div className='sidebar'>
				<h3 className='heading'>Personal</h3>
				<ul className='list'>
					{userslist.map((usuarios, index) => (
						<li key={index} className='listItem'>
							<div className={usuarios.nickname?.toString() !== nicknameGuardado ? 'ListItemA' : 'seleccionado'} style={{ marginLeft: '1.75vw' }} onClick={(e) => { e.preventDefault(); setNicknameGuardado(usuarios.nickname); seleccion(usuarios.nickname); seleccionFoto(usuarios.nickname); }} >
								<a href={`#${index}`} className={usuarios.nickname?.toString() !== nicknameGuardado ? 'appi' : 'appiSeleccionado'}>
									{usuarios.nickname}
								</a>
							</div>
						</li>
					))}
				</ul>
				<br />
				<br />
				<div className='logodiv'>
					<img src={logoSoporte} className='logo' alt="Logo de Soporte" />
				</div>
			</div >
			<div>
				<h2 className='titulo'>Soporte Técnico Honduras</h2>
				<div className='cajaInformacion' style={{ height: '58vh' }}>
					<h4 className='principal'>{userDatosSeleccionado?.nickname || "Usuario"}</h4>
					<div className='informacion' style={{ minHeight: '32vw', maxHeight: '34vw' }}>
						<div className='informacionesUsuario'>
							<div className='inforPerfil'>
								{renderCampo('foto', 'Foto')}
								<div className='fotoPerfil'>
									{imagenPerfil && (
										<img src={userFotoSeleccionado?.foto || imagenPerfil} className='perfilFoto' alt="Foto de perfil" />
									)}
								</div>
							</div>
							<div className='inforPerfil'>
								{renderCampo('nombre', 'Nombre')}
								{renderCampo('cedula', 'Cédula')}
								{renderCampo('localidad', 'Localidad')}
								{renderCampo('telefono', 'Telefono')}
							</div>
							<div className='inforPerfil'>
								{renderCampo('fecha_nacimiento', 'Nacimiento')}
								<h5 className='edad' >Edad: <span style={{ color: 'whitesmoke' }}>{edad} años</span></h5>
								{renderCampo('sexo', 'Sexo')}
								{renderCampo('grado_academico', 'Grado Académico')}
							</div>
							<div className='inforPerfil'>
								{renderCampo('fecha_contratacion', 'Contratación')}
								{renderCampo('puesto', 'Puesto')}
								{user && (user.id === 1 && userDatosSeleccionado?.id !== 1) && (
									<>
										{renderCampo('activo', 'Activo')}
									</>
								)}
							</div>
						</div>
						<div className='inforDescripcion'>
							{renderCampo('descripcion', 'Descripción')}
						</div>
					</div>
				</div>
			</div>
			<Toaster toastOptions={{ className: 'noti', duration: 750 }} />
		</>
	);
};