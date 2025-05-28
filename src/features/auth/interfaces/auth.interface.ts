export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  esDiscapacitado: boolean;
  porcentajeDiscapacidad: number;
  password: string;
}
