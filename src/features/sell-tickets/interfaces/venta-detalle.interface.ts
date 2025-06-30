import { VentaLista } from "./venta-lista.interface";

export interface VentaDetalle extends Omit<VentaLista, "boletos"> {
  boletos: (VentaLista["boletos"][number] & {
    cliente?: {
      id: number;
      nombres: string;
      apellidos: string;
      tipoDocumento: string;
      numeroDocumento: string;
      telefono: string;
      email: string;
    };
    asiento?: {
      id: number;
      numero: string;
      fila: number;
      columna: number;
      tipo: {
        id: number;
        nombre: string;
        factorPrecio: string;
      };
    };
    paradaOrigen?: {
      id: number;
      orden: number;
      precioAcumulado: string;
      ciudad: {
        id: number;
        nombre: string;
        provincia: string;
      };
    };
    paradaDestino?: {
      id: number;
      orden: number;
      precioAcumulado: string;
      ciudad: {
        id: number;
        nombre: string;
        provincia: string;
      };
    };
  })[];
}
