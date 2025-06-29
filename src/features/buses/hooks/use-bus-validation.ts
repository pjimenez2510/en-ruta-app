import { BusService } from "../services/bus.service";

interface ValidationResponse {
    exists: boolean;
    field: "numero" | "placa" | null;
}

export const useBusValidation = () => {
    const validateBusExists = async (
        numero: number | undefined,
        placa: string | undefined,
        currentBusId?: string
    ): Promise<ValidationResponse> => {
        if (!numero && !placa) {
            return { exists: false, field: null };
        }

        try {
            return await BusService.validateBusExists(
                numero,
                placa,
                currentBusId
            );
        } catch (error) {
            console.error('Error validating bus:', error);
            throw error;
        }
    };

    return { validateBusExists };
}; 