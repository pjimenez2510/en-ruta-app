import { SeatTemplate } from "./seat-template.interface";

export interface FloorTemplate {
    id: number;
    modeloBusId: number;
    numeroPiso: number;
    filas: number;
    columnas: number;
    descripcion: string;
    seats: SeatTemplate[];
}