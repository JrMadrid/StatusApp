/* DATOS DE LA UPS */
// Arreglara los datos de las ups
export const UPSdata = async (statusData, statusTransfeData, lastTransfeData, alarmCountData, dateData) => {
    const statusLimpio = statusData.replace("E000: Success", '').replace("Calibration Result: Unknown", '').replace("Calibration Date: Unknown", '').trim();
    const statusTransfe = `${statusTransfeData.replace("E000: Success", '')}` || '';
    const lastTransfe = `${lastTransfeData.replace("E000: Success", '')}` || '';
    const alarmCount = `${alarmCountData.replace("E000: Success", '')}` || '';
    const dateLimpio = `${dateData.replace("E000: Success", '')}` || '';

    const ReemplazoInicio = statusLimpio.indexOf('Next Battery Replacement Date: ');
    const ReemplazoFinal = ReemplazoInicio + 42;
    const Reemplazo = statusLimpio.substring(ReemplazoInicio, ReemplazoFinal);
    const ReemplazoFechaInicio = Reemplazo.indexOf(": ") + 2;
    const ReemplazoFechaFinal = Reemplazo.length;
    const ReemplazoFecha = Reemplazo.substring(ReemplazoFechaInicio, ReemplazoFechaFinal);
    const [mm, dd, yy] = ReemplazoFecha.split('/');
    const FechaReemplazoCorrecta = `${dd}/${mm}/${yy}`;
    const ReemplazoCorrecto = Reemplazo.replace(ReemplazoFecha, FechaReemplazoCorrecta)

    const fechaInicio = dateLimpio.indexOf('Date: ') + 6;
    const fechaFinal = fechaInicio + 10;
    const fecha = dateLimpio.substring(fechaInicio, fechaFinal)
    const [m, d, y] = fecha.split('/');
    const fechaCorrecta = `${d}/${m}/${y}`;

    const horaInicio = dateLimpio.indexOf('Time: ') + 6;
    const horaFinal = horaInicio + 8;
    const hora = dateLimpio.substring(horaInicio, horaFinal)
    const [hor, min, seg] = hora.split(':');
    const ampm = hor >= 12 ? 'PM' : 'AM';

    let BateriaSalud = '';
    if (statusLimpio.includes('Battery Health')) {
        const BateriaSaludInicio = statusLimpio.indexOf('Battery Health');
        const BateriaSaludFinal = statusLimpio.indexOf('Runtime Remaining') - 1;
        BateriaSalud = statusLimpio.substring(BateriaSaludInicio, BateriaSaludFinal) || '';
    }

    const BateriaEstadoInicio = statusLimpio.indexOf('Battery State Of Charge');
    const BateriaEstadoFinal = statusLimpio.indexOf('Output Voltage') - 1;
    const BateriaEstado = statusLimpio.substring(BateriaEstadoInicio, BateriaEstadoFinal);

    const status = statusLimpio.replace(Reemplazo, '').replace(BateriaSalud, '').replace(BateriaEstado, '').trim();

    const DataUPS = {
        informacionimportante: `${ReemplazoCorrecto}`,
        informacionimportante2: `Status: Hora ${hora} ${ampm} Fecha ${fechaCorrecta}`,
        informacionrelevante: `${BateriaSalud} ${BateriaEstado}`,
        informaciontecnica: `${status} ${statusTransfe} ${lastTransfe} ${alarmCount}`,
    }

    return DataUPS;
};

// Arreglara los datos de hardware de las ups
export const UPShardware = async (aboutData, upsaboutData) => {

    const aboutLimpio = `${aboutData.replace("E000: Success", '')}` || '';
    const upsaboutLimpio = `${upsaboutData.replace("E000: Success", '')}` || '';

    const aboutFinal = aboutLimpio.indexOf('Application Module') - 1
    const aboutParte = aboutLimpio.substring(0, aboutFinal);

    const HardwareRevisionInicio = aboutParte.indexOf('Hardware Revision');
    const HardwareRevisionFinal = aboutParte.indexOf('Manufacture Date') - 1;
    const HardwareRevision = aboutParte.substring(HardwareRevisionInicio, HardwareRevisionFinal);

    const about = aboutParte.replace(HardwareRevision, '');

    const RealPowerInicio = upsaboutLimpio.indexOf('Real Power Rating');
    const RealPowerFinal = upsaboutLimpio.indexOf('Battery SKU') - 1;
    const RealPower = aboutLimpio.substring(RealPowerInicio, RealPowerFinal);

    const upsabout = upsaboutLimpio.replace(RealPower, '');

    const HardwareUPS = {
        informaciongeneral: `${about} ${upsabout}`
    }

    return HardwareUPS;
};

// Arreglara los datos de descripción de las ups
export const UPSdescripcion = async (upsaboutData) => {

    let Modelo = ''
    if (upsaboutData.includes('Model:')) {
        const ModeloInicio = upsaboutData.indexOf('Model:')
        const ModeloFinal = upsaboutData.indexOf('SKU') - 1;
        const Modelo1 = upsaboutData.substring(ModeloInicio, ModeloFinal);
        Modelo = Modelo1.replace("Model: ", '')
    }


    const descripcionUPS = {
        descripcion: `${Modelo}`
    }
    return descripcionUPS;
};