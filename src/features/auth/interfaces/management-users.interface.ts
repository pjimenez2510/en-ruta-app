export interface User {
  cedula: string;
  nombreCompleto: string;
  password: string;
  rol: "chofer" | "vendedor";
}

export interface SRIResponse {
  contribuyente: {
    identificacion: string;
    nombreComercial: string;
    [key: string]: any;
  };
  [key: string]: any;
} 