/* FUNCIÓN DE PING */

import fetchData from "../api/connect";
import { toast } from 'react-hot-toast';

// Hacer ping a la ip
const ping = async (ip) => {
    toast.promise(
        fetchData(`http://${process.env.REACT_APP_HOST}/panel/ping/${ip}`).then(async (response) => {
            const silbato = await response.json();
            if (!response.ok) {
                throw new Error(silbato.message || 'Lo sentimos, ocurrió un problema');
            }
            return silbato.silbido;
        }),
        {
            loading: 'Cargando ping...',
            success: (data) => {
                if (data) {
                    return <b style={{ color: 'green', fontSize: '25px' }}>Se logró la conexión</b>;
                } else {
                    return <b style={{ color: 'red', fontSize: '25px' }}>No hay conexión</b>;
                }
            },
            error: () => {
                return <b>¡Ocurrió un error!</b>;
            },
        },
        {
            style: {
                minWidth: '250px',
                maxWidth: '250px',
                minHeight: '25px',
                maxHeight: '25px',
            },
            success: {
                duration: 5000,
                icon: null, // O '' para asegurarte de que no se muestre ningún ícono
            },
        }
    );
};

export default ping;