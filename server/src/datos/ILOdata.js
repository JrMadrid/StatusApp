/* DATOS DE LA ILO */
// Arreglara los datos de las ilo
export const ILOdata = async (showData) => {

  const DataILO = {
    informacionimportante: ``,
    informacionimportante2: ``,
    informacionrelevante: ``,
    informaciontecnica: showData,
  }

  return DataILO;
};

// Arreglara los datos de hardware de las ilo
export const ILOhardware = async () => {

  const HardwareILO = {
    informaciongeneral: ``
  }

  return HardwareILO;
};

// Arreglara los datos de descripción de las ilo
export const ILOdescripcion = async () => {
  let Modelo = '';

  const descripcionILO = {
    descripcion: `${Modelo}`
  }
  return descripcionILO;
};