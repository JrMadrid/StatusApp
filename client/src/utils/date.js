/* FUNCIÓN DAR FORMATO A LAS FECHAS */
const date = () => {
    const now = new Date();
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let hours = now.getHours();
    // Convertir a formato de 12 horas
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // la hora '0' debe convertirse en '12'
    const strHours = String(hours).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve 0-11
    const year = now.getFullYear();

    return `${strHours}:${minutes}:${seconds} ${ampm}  ${day}/${month}/${year}`; // Formato: HH:MM:SS DD/MM/YYY
};

export default date;