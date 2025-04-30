/* CONFIGURACIÓN DE AXIOS */
import axios from 'axios'; // Importa la librería axios para realizar solicitudes HTTP

// Configura axios para enviar cookies con cada solicitud
axios.defaults.withCredentials = true; // Permite el uso de cookies en solicitudes CORS

export default axios;