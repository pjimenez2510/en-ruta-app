import { IconName } from '../constants/available-icons';

export interface SeatType {
    id: number;
    nombre: string;
    descripcion: string;
    factorPrecio: number;
    activo: boolean;
    color: string;
    icono: IconName;
    tenantId: string;
}