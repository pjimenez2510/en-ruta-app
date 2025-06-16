export interface Usuario {
  id: number;
  username: string;
  tipoUsuario: string;
  fechaRegistro: string;
  ultimoAcceso: string | null;
  activo: boolean;
}

export interface InfoPersonal {
  id: number;
  usuarioTenantId: number;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
  ciudadResidencia: string;
  genero: "Masculino" | "Femenino" | "Otro";
  fotoPerfil: string | null;
  licenciaConducir: string | null;
  tipoLicencia: string | null;
  fechaExpiracionLicencia: string | null;
  fechaContratacion: string;
  fechaRegistro: string;
  ultimaActualizacion: string;
  activo: boolean;
}

export interface UserTenant {
  id: number;
  fechaAsignacion: string;
  tenantId: number;
  rol: string;
  activo: boolean;
  infoPersonal: InfoPersonal | null;
  usuario: Usuario;
}

export interface CreateUserTenantDto {
  rol: string;
  password: string;
  usuario: {
    username: string;
  };
  infoPersonal: {
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    telefono: string;
    email: string;
    fechaNacimiento: string;
    direccion: string;
    ciudadResidencia: string;
    genero: string;
    fotoPerfil: string;
    fechaContratacion: string;
    licenciaConducir: string;
    tipoLicencia: string;
    fechaExpiracionLicencia: string;
  };
}

export interface UpdateUserTenantDto {
  rol: string;
  usuario: {
    username: string;
  };
  infoPersonal: {
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    telefono: string;
    email: string;
    fechaNacimiento: string;
    direccion: string;
    ciudadResidencia: string;
    genero: string;
    fotoPerfil: string;
    fechaContratacion: string;
    licenciaConducir: string;
    tipoLicencia: string;
    fechaExpiracionLicencia: string;
  };
}

export interface UserTenantResponse {
  data: UserTenant[];
  message: string | null;
  error: string | null;
  statusCode: number;
}

export interface SRIResponse {
  nombreCompleto: string;
}
