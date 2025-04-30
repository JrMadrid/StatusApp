/* HACER PING A UN HOST */
// Importo la librería 'ping' que permite realizar pruebas de conectividad a través de ICMP
import ping from 'ping';

/**
 * Realiza un ping a un host (IP o nombre de dominio) y devuelve el resultado.
 * @param {string} host - Dirección IP o nombre del host al que se le hará ping.
 * @returns {Promise<object>} - Objeto que indica si el host está vivo (true) o no (false), o un mensaje de error.
 */
const pingHost = async (host) => {
    let silbido = '';
    try {
        // Realizo el ping al host especificado
        const res = await ping.promise.probe(host);

        // Guardo el resultado (true si está vivo, false si no)
        silbido = res.alive;
    } catch (error) {
        // Si ocurre un error, asigno un mensaje de error
        silbido = `Error al hacer ping a: ${host}`;
    }

    // Devuelvo el resultado dentro de un objeto
    return { silbido };
};

export default pingHost;