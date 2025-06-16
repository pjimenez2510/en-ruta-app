export interface Seat {
    pisoBusId: number;
    numero: string;
    fila: number;
    columna: number;
    tipoId: number;
    estado: string;
    notas: string;
}

export interface SeatUpdate {
    pisoBusId: number;
    numero: string;
    fila: number;
    columna: number;
    tipoId: number;
    estado: string;
}