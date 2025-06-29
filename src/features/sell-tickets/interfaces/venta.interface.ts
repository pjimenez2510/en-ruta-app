export interface Boleto {
  clienteId: number;
  asientoId: number;
}

export interface CrearVentaData {
  viajeId: number;
  ciudadOrigenId: number;
  ciudadDestinoId: number;
  metodoPagoId: number;
  oficinistaId: number;
  boletos: Boleto[];
}

export interface Venta {
  id: number;
  viajeId: number;
  ciudadOrigenId: number;
  ciudadDestinoId: number;
  metodoPagoId: number;
  oficinistaId: number;
  fechaVenta: string;
  total: number;
  estado: string;
  boletos: Boleto[];
}

// Interfaces para el formulario de venta
export interface ClienteAsiento {
  id: string; // ID único para el formulario
  cliente: {
    id: number;
    nombre: string;
    documento: string;
    email: string;
    telefono: string;
  } | null;
  asiento: {
    id: number;
    numero: string;
    tipo: string;
    precio: number;
  } | null;
}

export interface FormularioVenta {
  viajeId: number;
  ciudadOrigenId: number;
  ciudadDestinoId: number;
  metodoPagoId: number | null;
  oficinistaId: number;
  clienteAsientos: ClienteAsiento[];
}
