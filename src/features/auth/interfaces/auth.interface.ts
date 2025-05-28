export interface LoginInput {
  email: string;
  password: string;
}

interface Cliente {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  esDiscapacitado?: boolean;
  porcentajeDiscapacidad?: number;
}

export interface RegisterInput {
  email: string;
  password: string;
  cliente: Cliente;
}
