import { BusFormValues } from "./form-schema";

export interface BusSeat {
    id?: number;
    pisoBusId: number;
    numero: string;
    fila: number;
    columna: number;
    tipoId: number;
    estado: "DISPONIBLE" | "OCUPADO" | "MANTENIMIENTO";
}

export interface BusFloor {
    numero: number;
    asientos: BusSeat[];
    columnas: number;
}

export interface BusConfiguration {
    pisoBusId: number;
    numeroPiso: number;
    asientos: BusSeat[];
}

export interface BusCreationData {
    busInfo: BusFormValues & {
        fechaIngreso: string;
        estado: string;
    };
    pisos: BusConfiguration[];
} 