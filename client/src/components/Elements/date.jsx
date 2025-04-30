/* COMPONENTE DE ELEMENTO DE FORMATO DE FECHA */
import React from 'react';

// Función para limpiar el formato de la fecha para dejar solo dias, mes y año
function FormatearFecha(fechaISO) {
    const fechaSolo = fechaISO.split('T')[0]; // 2025-01-01T00:00:00.000Z -> 2025-01-01
    return `${fechaSolo}`;
};

// Función para formatear la fecha en el formato deseado para la visualización
const FormatearFechaTabla = ({ fecha }) => {
    const date = new Date(fecha);
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dd = date.getUTCDate();
    const mm = meses[date.getUTCMonth()];
    const yy = date.getUTCFullYear();

    const fechaFormateada = `${dd}/${mm}/${yy}`;

    return (
        <span>{fechaFormateada}</span>
    );
};

// Función para formatear la fecha en el formato deseado para la busqueda
function FormatearFechaBusqueda(fechaISO) {
    let fechaSolo = fechaISO.split('T')[0]; // 2025-01-01T00:00:00.000Z -> 2025-01-01
    fechaSolo = `${fechaSolo}`;
    let [yy, mm, dd] = fechaSolo.split('-');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    mm = parseInt(mm);
    mm = meses[mm - 1]
    let fechacons = `${dd}/${mm}/${yy}`
    return fechacons;
};

export { FormatearFecha, FormatearFechaTabla, FormatearFechaBusqueda };