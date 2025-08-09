/* FUNCIÓN DAR FORMATO A LAS FECHAS DADAS POR SQL*/
const fechaFomatoSQL = (fechaISO)=>{
    let fechaSolo = fechaISO.split('T')[0]; // 2025-01-01T00:00:00.000Z -> 2025-ENERO-01
    fechaSolo = `${fechaSolo}`;
    let [yy, mm, dd] = fechaSolo.split('-');
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    mm = parseInt(mm);
    mm = meses[mm - 1]
    let fechacons = `${dd}/${mm}/${yy}`
    return fechacons;
};

export default fechaFomatoSQL