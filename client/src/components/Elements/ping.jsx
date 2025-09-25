/* COMPONENTE ICONO DE PING */
import ping from "../../utils/ping";
import { HiStatusOnline } from "react-icons/hi";

// Manda ip para ping
export default function Pingdispo(host) {
  return (
    <>
      <HiStatusOnline onClick={() => { ping(host.ip) }} />
    </>
  )
};