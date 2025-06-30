export interface VentaLista {
  id: number;
  tenantId: number;
  viajeId: number;
  usuarioId: number;
  oficinistaId: number | null;
  fechaVenta: string;
  metodoPagoId: number;
  totalSinDescuento: string;
  totalDescuentos: string;
  totalFinal: string;
  estadoPago: string;
  tenant: {
    id: number;
    nombre: string;
  };
  viaje: {
    id: number;
    fecha: string;
    estado: string;
    horarioRuta: {
      id: number;
      horaSalida: string;
      ruta: {
        id: number;
        nombre: string;
      };
    };
    bus: {
      id: number;
      numero: number;
      placa: string;
    };
  };
  comprador: {
    id: number;
    username: string;
  };
  oficinista: null | {
    id: number;
    username: string;
  };
  metodoPago: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  boletos: {
    id: number;
    clienteId: number;
    asientoId: number;
    paradaOrigenId: number;
    paradaDestinoId: number;
    precioBase: string;
    tipoDescuento: string;
    porcentajeDescuento: string;
    precioFinal: string;
    codigoAcceso: string;
    estado: string;
  }[];
}
