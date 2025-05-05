/* COMPONENTE ICONO DE PING */
import { React } from "react";
import ping from "../../tools/ping";
import { HiStatusOnline } from "react-icons/hi";

// Manda ip para ping
export default function Pingdispo(host) {
    
    return (
        <>
            <HiStatusOnline onClick={() => { ping(host.ip) }} />
        </>
    )
};