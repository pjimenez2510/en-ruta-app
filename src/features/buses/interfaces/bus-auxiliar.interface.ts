import { SeatType } from "@/features/seating/interfaces/seat-type.interface";
import { BusSeat } from "./seat-config";
import { BusFormValues } from "./form-schema";
import { BusModel } from "./bus-model.interface";

export interface BusFilter {
    numero?: string;
    placa?: string;
    estado?: string;
    modeloBusId?: number;
    anioFabricacion?: number;
}

export interface FloorConfig {
    pisoBusId: number;
    numeroPiso: number;
    leftColumns: number;
    rightColumns: number;
    rows: number;
    asientos: BusSeat[];
    posicionPasillo?: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface SeatGridSimpleProps {
    floor: FloorConfig;
    floorDimensions: { [key: number]: FloorConfig };
    availableSeatTypes: SeatType[];
}

export interface SeatGridProps {
    floorConfig: FloorConfig;
    seatTypes: SeatType[];
    disabled?: boolean;
    templateApplied?: boolean;
}

export interface SeatCellProps {
    row: number;
    col: number;
    floorConfig: FloorConfig;
    seatTypes: SeatType[];
    disabled: boolean;
}

export interface SeatTypeLegendProps {
    seatTypes: SeatType[];
}

export interface ValidationResponse {
    exists: boolean;
    field: "numero" | "placa" | null;
}

export interface UseFloorConfigurationProps {
    busInfo: BusFormValues & { totalAsientos: number };
    busModels: BusModel[];
    initialData?: BusFormValues & {
        totalAsientos?: number;
        pisos?: Array<{
            id: number;
            busId: number;
            numeroPiso: number;
            asientos: BusSeat[];
        }>;
    };
}

export interface SourceInfo {
    typeId?: number;
    floor?: number;
    row?: number;
    col?: number;
}

export interface FloorData {
    numeroPiso: number;
    asientos: BusSeat[];
}

export interface SeatGridConfig {
    maxFila: number;
    posicionPasillo: number;
    leftColumns: number;
    rightColumns: number;
}