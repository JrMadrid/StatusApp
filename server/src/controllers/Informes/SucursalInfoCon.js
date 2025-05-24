/* CONTROLADORES DE INFORME -- SUCURSAL */
import { obtenerDatosAplicaciones, nombreDispositivoXIP, informationGneralDispositivo, dispositiosValidos, actualizarInformacionGeneral, actualizarInformacionDescripcion } from '../../services/Informes/SucursalInfoSer.js';
const isMock = 'true'; // process.env.USE_MOCK accede al valor de la variable de entorno USE_MOCK. Si el valor es la cadena 'true', entonces isMock será true. Si no, será false.
// UPS
const { UPSssh: RealUPSssh, UPSHardware: RealUPSHardware, UPSDescripcion: RealUPSDescripcion } = await import('../../connection/UPSssh.js');
const { UPSssh: MockUPSssh, UPSHardware: MockUPSHardware, UPSDescripcion: MockUPSDescripcion } = await import('../../mocks/UPSmock.js');
const UPSssh = isMock ? MockUPSssh : RealUPSssh;
const UPSHardware = isMock ? MockUPSHardware : RealUPSHardware;
const UPSDescripcion = isMock ? MockUPSDescripcion : RealUPSDescripcion;
// import { UPSssh, UPSHardware, UPSDescripcion } from '../../connection/UPSssh.js';
// ILO
// import { ILOssh, ILOHardware, ILODescripcion } from '../../connection/ILOssh.js';
// Biometrico
const { BIOMETRICOtcpip: RealBIOMETRICOtcpip, BiometricoHardware: RealBiometricoHardware } = await import('../../connection/BIOMETRICOtcpip.js');
const { BiometricoData: MockBIOMETRICOtcpip, Biometricohardware: MockBiometricoHardware } = await import('../../mocks/BIOMETRICOmock.js');
const BIOMETRICOtcpip = isMock ? MockBIOMETRICOtcpip : RealBIOMETRICOtcpip;
const BiometricoHardware = isMock ? MockBiometricoHardware : RealBiometricoHardware;
// import { BIOMETRICOtcpip, BiometricoHardware } from '../../connection/BIOMETRICOtcpip.js';
const { BIOMETRICOsolicitud: RealBIOMETRICOsolicitud } = await import('../../datos/Solicitudes/SolBiometricos.js');
const { BIOMETRICOsolicitudMock: MockBIOMETRICOsolicitud } = await import('../../mocks/Simular/SimBiometrico.js');
const BIOMETRICOsolicitud = isMock ? MockBIOMETRICOsolicitud : RealBIOMETRICOsolicitud;
// import { BIOMETRICOsolicitud } from '../../datos/Solicitudes/SolBiometricos.js';

// Pide el número económico
const economico = async (req, res) => {
	try {
			const numero = req.params.economico; // Obtiene el número económico de la URL
			req.session.numero = numero; // Guarda el número económico en la sesión
			req.session.save(err => { // Guarda la sesión y maneja posibles errores
				if (err) {
					console.error('Error al guardar la sesión:', err);
				}
			});
	} catch (error) {
		console.error('Error :', error);
	}
}

// Consulta y retorna los dispositivos registrados por número económico
const aplicaciones = async (req, res) => {
		try {
			// await dbConnection(); solo se inicia la conexion al arrancar el servidor; // Conecta a la base de datos
			const economico = req.session.numero; // Recupera el número económico de la sesión
			const aplicaciones = await obtenerDatosAplicaciones(economico); // Ejecuta la consulta

			return res.json(aplicaciones) // Retorna el resultado en formato JSON

		} catch (error) {
			console.error('Error :', error);
		}
};

// Obtiene la información general de un dispositivo en específico por su IP
const info = async (req, res) => {
		try {
			let sshInfo; // Variable para almacenar la información que se obtenga vía SSH o TCP/IP
			const ip = req.params.ip; // Se obtiene la IP desde los parámetros de la URL
			req.session.aplicacionip = ip; // Guarda la IP en sesión

			// Consulta el tipo de dispositivo asociado a la IP
			const dispositivo = await nombreDispositivoXIP(ip);
			req.session.aplicacion = dispositivo; // Guarda el nombre del dispositivo en la sesión

			// Dependiendo del tipo de dispositivo, realiza la conexión correspondiente
			if (dispositivo === 'UPS') {
				sshInfo = await UPSssh(ip);
			}
			if (dispositivo === 'Biometrico') {
				sshInfo = await BIOMETRICOtcpip(ip);
			}

			// Consulta información general y de la sucursal del dispositivo
			const dbInfo = await informationGneralDispositivo(ip);

			// Se fusiona la información de la base de datos con la obtenida por SSH/TCP
			const Infos = Object.assign({}, sshInfo, dbInfo);
			const Info = [Infos];

			res.json(Info); // Retorna la información combinada
		} catch (error) {
			console.error('Error:', error);
			res.status(500).send("Error al obtener los datos");
		}
}

// Recorre los dispositivos de una sucursal y actualiza la información si es necesario
const dispositivos = async (req, res) => {
		try {
			// await dbConnection(); solo se inicia la conexion al arrancar el servidor;
			const economico = req.session.numero; // Obtiene el número económico de la sesión

			// Consulta todos los dispositivos válidos de la sucursal
			const dbInfo = await dispositiosValidos(economico);

			// Recorre cada dispositivo para validar y actualizar la información faltante
			for (let i = 0; i < dbInfo.length; i++) {
				let ip = dbInfo[i].ip;

				// Verifica que la IP sea válida
				if (!ip.startsWith('000.') || !ip.startsWith('001.')) {

					// Si el campo "general" está vacío o nulo, se actualiza
					if (dbInfo[i].general === null || dbInfo[i].general === '') {
						let sshInfo = '';
						let general = '';

						// Solo realiza la conexión SSH si es una UPS
						if (dbInfo[i].nombre === 'UPS') {
							sshInfo = await UPSHardware(ip);
							general = sshInfo.informaciongeneral;
						}
						// Conexiones futuras para ILO o Biometrico están comentadas

						// Actualiza el campo "general" en la base de datos
						await actualizarInformacionGeneral(general, ip);
					}

					// Si el campo "descripcion" está vacío o nulo, se actualiza
					if (dbInfo[i].descripcion === null || dbInfo[i].descripcion === '') {
						let sshInfo = '';
						let descripcion = '';

						// Solo realiza la conexión SSH si es una UPS
						if (dbInfo[i].nombre === 'UPS') {
							sshInfo = await UPSDescripcion(ip);
							descripcion = sshInfo.descripcion;
						}

						// Actualiza el campo "descripcion" en la base de datos
						await actualizarInformacionDescripcion(descripcion, ip);
					}
				}
			}
			res.json(dbInfo); // Retorna la información actualizada de los dispositivos
		} catch (error) {
			console.error('Error:', error);
			res.status(500).send("Error al obtener los datos");
		}
};

// Enviar solicitudes o comandos al biométrico
const solicitudes = async (req, res) => {
	try {
		// Solo se permite si la aplicación actual en sesión es un biométrico
		if (req.session.aplicacion === 'Biometrico') {
			const ip = req.session.aplicacionip; // Recupera la IP desde la sesión
			const comando = req.body.id; // Obtiene el comando desde el body de la solicitud
			const mensaje = await BIOMETRICOsolicitud(ip, comando); // Ejecuta la solicitud al biométrico

			res.json(mensaje); // Retorna la respuesta del biométrico
		}
	} catch (error) {
		console.error('Error al ejecutar la solicitud:', error);
	}
};

// Exporta los métodos como un objeto para su uso en rutas
export const methods = {
	info,
	economico,
	aplicaciones,
	dispositivos,
	solicitudes
};