/* SIMULAR ABRIR LA PUERTA*/
export const BIOMETRICOsolicitudMock = async (ip, comando) => {
  console.log(`[MOCK] Se simula solicitud al biométrico IP: ${ip}, comando: ${comando}`);

  return {
    message: comando === 31, // si el comando es abrir puerta, retorna true
    comando: `${comando}`
  };
};