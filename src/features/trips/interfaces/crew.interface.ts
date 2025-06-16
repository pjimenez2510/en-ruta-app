export interface RouteSchedule {
  id: number;
  rutaId: number;
  horaSalida: string;
  diasSemana: string;
  activo: boolean;
  ruta?: {
    id: number;
    nombre: string;
    descripcion: string;
  };
}

interface ModeloBus {
  id: number;
  marca: string;
  modelo: string;
  tipoChasis: string;
  tipoCarroceria: string;
  numeroPisos: number;
}

interface Tenant {
  id: number;
  nombre: string;
}

export interface Bus {
  id: number;
  tenantId: number;
  modeloBusId: number;
  numero: number;
  placa: string;
  anioFabricacion: number;
  totalAsientos: number;
  fotoUrl: string;
  tipoCombustible: string;
  fechaIngreso: string;
  estado: string;
  tenant?: Tenant;
  modeloBus?: ModeloBus;
}

export interface CrewMember {
  id: number;
  usuarioTenantId: number;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  email: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UsuarioTenant {
  id: number;
  tenantId: number;
  usuarioId: number;
  rol: 'CONDUCTOR' | 'AYUDANTE' | 'ADMIN' | 'CLIENTE';
  activo: boolean;
  usuario?: User;
}

export interface DriverUser extends UsuarioTenant {
  rol: 'CONDUCTOR';
}

export interface HelperUser extends UsuarioTenant {
  rol: 'AYUDANTE';
}
