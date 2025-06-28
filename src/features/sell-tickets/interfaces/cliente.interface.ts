export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  fechaRegistro: string;
  ultimaActualizacion: string;
  activo: boolean;
  esDiscapacitado: boolean;
  porcentajeDiscapacidad: string;
  numeroDocumento: string;
  tipoDocumento: string;
  fechaNacimiento: string;
}
