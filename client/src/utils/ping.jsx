/* COMPONENTE ICONO DE PING */
import { React } from "react";
import fetchData from "../api/connect";
import { toast } from 'react-hot-toast'; // Notificaciones
import { HiStatusOnline } from "react-icons/hi";

// Manda ip para ping
export default function Pingdispo(ip) {    
    const ping = async (ip) => {
        toast.promise(
            fetchData(`http://${process.env.REACT_APP_HOST}/apps/ping/${ip}`).then(async (response) => {
                if (!response.ok) {
                    throw new Error('Sin respuesta');
                }
                const silbato = await response.json();
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
                    return <b>Sin información, ocurrió un error!</b>;
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
    }
    return (
        <>
            <HiStatusOnline onClick={() => { ping(ip.ip) }} />
        </>
    )
};