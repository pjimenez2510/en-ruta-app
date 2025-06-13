import { BusSeat } from "./seat-config";

export interface Bus {
    id: string;
    tenantId: string;
    modeloBusId: number;
    numero: number;
    placa: string;
    anioFabricacion: number;
    totalAsientos: number;
    fotoUrl?: string;
    tipoCombustible: string;
    fechaIngreso: string;
    estado: string;

    modeloBus: {
        id: number;
        marca: string;
        modelo: string;
        tipoChasis: string;
        tipoCarroceria: string;
        numeroPisos: number;
    };
    pisos?: Array<{
        id: number;
        busId: number;
        numeroPiso: number;
        asientos: BusSeat[];
    }>;
} 