export interface LoginInput {
  username: string;
  password: string;
}

interface Cliente {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string;
  username?: string;
  email?: string;
  fechaNacimiento?: string;
  esDiscapacitado?: boolean;
  porcentajeDiscapacidad?: number;
}

export interface RegisterInput {
  username: string;
  password: string;
  cliente: Cliente;
}

export interface RegisterCooperativaInput {
  username: string;
  password: string;
  tenant: {
    nombre: string;
    identificador: string;
    sitioWeb?: string;
    emailContacto: string;
    telefono: string;
  };
}
