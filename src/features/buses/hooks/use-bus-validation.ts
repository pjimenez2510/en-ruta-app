import { BusService } from "../services/bus.service";
import { useSession } from "next-auth/react";

interface ValidationResponse {
    exists: boolean;
    field: "numero" | "placa" | null;
}

export const useBusValidation = () => {
    const { data: session } = useSession();

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
                currentBusId,
                session?.user.accessToken
            );
        } catch (error) {
            console.error('Error validating bus:', error);
            throw error;
        }
    };

    return { validateBusExists };
}; 