"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeatType } from "@/features/seating/interfaces/seat-type.interface";
import { useBuses } from "../hooks/use-buses";
import { SeatUpdate } from "../interfaces/seat.interface";

interface SeatTypeSelectorProps {
    seatId: number;
    currentSeat: {
        numero: string;
        fila: number;
        columna: number;
        tipoId: number;
        estado: string;
        pisoBusId: number;
    };
    seatTypes: SeatType[];
    onUpdate?: () => void;
}

export const SeatTypeSelector = ({ seatId, currentSeat, seatTypes, onUpdate }: SeatTypeSelectorProps) => {
    const { updateSingleSeat } = useBuses();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSeatTypeChange = async (newTypeId: string) => {
        try {
            setIsUpdating(true);
            
            const seatData: SeatUpdate = {
                ...currentSeat,
                tipoId: parseInt(newTypeId)
            };

            await updateSingleSeat(seatId, seatData);
            onUpdate?.();
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Select
            value={currentSeat.tipoId.toString()}
            onValueChange={handleSeatTypeChange}
            disabled={isUpdating}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
                {seatTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                        {type.nombre}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}; 