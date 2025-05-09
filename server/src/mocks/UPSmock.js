/* DATOS MOCK DE LA UPS */
// Simula una conexión exitosa y devuelve datos de UPS como si hubieran sido obtenidos por SSH
export const UPSssh = async (host) => {
  return {
    informacionimportante: 'Next Battery Replacement Date: 12/07/2025',
    informacionimportante2: 'Status: Hora 10:22:30 AM Fecha 08/05/2025',
    informacionrelevante: 'Battery Health: Good Battery State Of Charge: 100%',
    informaciontecnica: 'Output Voltage: 230V Transfer Status: OK Last Transfer: 04/05/2025 Alarm Count: 0'
  };
};

export const UPSHardware = async (host) => {
  return {
    informaciongeneral: 'Model: Smart-UPS 1500VA Hardware Revision: R1 Manufacture Date: 01/2023 Application Module: V3 Real Power Rating: 900W Battery SKU: RBC7'
  };
};

export const UPSDescripcion = async (host) => {
  return {
    descripcion: 'Smart-UPS 1500VA'
  };
};
