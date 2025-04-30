/* DATOS DEL BIOMETRICO */
// Ejecutar comando para obtener datos del biometrico
export const BiometricoData = async (deviceinfo) => {
    let conexion = ''
    if (deviceinfo) {
        conexion = 'Conexión TCP establecida';
    }
    const DataBiometrico = {
        informacionimportante: conexion,
        informacionimportante2: '',
        informacionrelevante: '',
        informaciontecnica: ''
    }

    return DataBiometrico;
};

//Conectamos al Biometrico por tcp para guardar los datos del hardware
export const Biometricohardware = async (responseCode, buffer) => {
    let response = '';

    // Compara el código de repuesta con CMD_ACK_OK (2000)
    if (responseCode === 2000) {

        // Verificamos  que el buffer tenga suficientes datos
        if (buffer.length < 16) {
            response = ''; // Buffer insuficientes
        } else {
            // La versión comienza en el byte 10 y se extiende hasta el primer null
            const versionBuffer = buffer.slice(8, buffer.indexOf(0, 10)); // Extraemos los bytes de la version hasta el null
            const versionString = versionBuffer.toString('utf8').trim(); // Convertimos a string

            // Limpiamos la cadena de caracteres no deseados
            response = versionString.replace(/\s+/g, ' '); // Reemplazamos múltiples espacios por uno solo
        }
    } else {
        response = ''; // Código de respuesta no válido
    }

    const HardwareBiometrico = {
        informaciongeneral: response ? `Firmware: ${response}` : ''
    };

    return HardwareBiometrico;
};