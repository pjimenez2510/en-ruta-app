import { API_ROUTES } from '@/core/constants/api-routes';
import AxiosClient from '@/core/infrastructure/axios-client';
import { Bus } from "../interfaces/bus.interface";
import { BusCreationData } from '../interfaces/seat-config';
import { BusFloor } from '../interfaces/bus-floor.interface';
import { SeatUpdate } from '../interfaces/seat.interface';

interface BusAsiento {
    id: number;
    numero: string;
    fila: number;
    columna: number;
    tipoId: number;
    estado: "DISPONIBLE" | "OCUPADO" | "MANTENIMIENTO";
    pisoBusId: number;
}

const axiosClient = AxiosClient.getInstance();

export const BusService = {
    getAll: async (): Promise<Bus[]> => {
        const response = await axiosClient.get<Bus[]>(API_ROUTES.BUSES.BASE);
        return response.data.data;
    },

    getById: async (id: string): Promise<Bus | null> => {
        try {
            const response = await axiosClient.get<Bus>(`${API_ROUTES.BUSES.BASE}/${id}`);

            // Obtener los pisos del bus
            const pisosResponse = await axiosClient.get<BusFloor[]>(`${API_ROUTES.BUSES.PISOS}?busId=${id}`);

            // Obtener los asientos para cada piso
            const pisosConAsientos = await Promise.all(
                pisosResponse.data.data.map(async (piso: BusFloor) => {
                    const asientosResponse = await axiosClient.get<BusAsiento[]>(`${API_ROUTES.BUSES.ASIENTOS}?pisoBusId=${piso.id}`);
                    return {
                        ...piso,
                        asientos: asientosResponse.data.data
                    };
                })
            );

            return {
                ...response.data.data,
                pisos: pisosConAsientos
            };
        } catch (error) {
            console.error('Error getting bus by id:', error);
            throw error;
        }
    },

    create: async (data: BusCreationData): Promise<Bus | null> => {
        try {
            // 1. Crear el bus
            const busResponse = await axiosClient.post<Bus>(API_ROUTES.BUSES.BASE, data.busInfo);
            const busId = busResponse.data.data.id;

            // 2. Crear los pisos uno por uno
            for (const piso of data.pisos) {
                const pisoResponse = await axiosClient.post<BusFloor>(API_ROUTES.BUSES.PISOS, {
                    busId,
                    numeroPiso: piso.numeroPiso,
                });

                const pisoBusId = pisoResponse.data.data.id;

                // 3. Crear los asientos de manera masiva para cada piso
                if (piso.asientos.length > 0) {
                    await axiosClient.post(API_ROUTES.BUSES.ASIENTOS_MASIVO, {
                        pisoBusId,
                        asientos: piso.asientos.map(asiento => ({
                            ...asiento,
                            estado: "DISPONIBLE"
                        }))
                    });
                }
            }

            return busResponse.data.data;
        } catch (error) {
            console.error('Error creating bus:', error);
            throw error;
        }
    },

    update: async (id: string, busData: Partial<Bus>): Promise<Bus | null> => {
        try {
            const response = await axiosClient.put<Bus>(`${API_ROUTES.BUSES.BASE}/${id}`, busData);
            return response.data.data;
        } catch (error) {
            console.error('Error updating bus:', error);
            throw error;
        }
    },

    updateSeats: async (
        busId: string,
        seats: Array<{
            numeroPiso: number;
            asientos: Array<{
                numero: string;
                fila: number;
                columna: number;
                tipoId: number;
                estado: string;
            }>;
        }>
    ): Promise<void> => {
        for (const piso of seats) {
            await axiosClient.put(`${API_ROUTES.BUSES.BASE}/${busId}/pisos/${piso.numeroPiso}/asientos`, {
                asientos: piso.asientos
            });
        }
    },

    updateSingleSeat: async (seatId: number, seatData: SeatUpdate): Promise<void> => {
        try {
            console.log('Updating seat:', seatData);
            await axiosClient.put(`${API_ROUTES.BUSES.ASIENTOS}/${seatId}`, seatData);
        } catch (error) {
            console.error('Error updating seat:', error);
            throw error;
        }
    },

    setMantenimiento: async (id: string): Promise<boolean> => {
        await axiosClient.put(`${API_ROUTES.BUSES.BASE}/${id}/mantenimiento`, {});
        return true;
    },

    setActivo: async (id: string): Promise<boolean> => {
        await axiosClient.put(`${API_ROUTES.BUSES.BASE}/${id}/activar`, {});
        return true;
    },

    setRetirado: async (id: string): Promise<boolean> => {
        await axiosClient.put(`${API_ROUTES.BUSES.BASE}/${id}/retirar`, {});
        return true;
    },

    validateBusExists: async (
        numero?: number,
        placa?: string,
        busId?: string
    ): Promise<{ exists: boolean; field: "numero" | "placa" | null }> => {
        try {
            let busesNumber: Bus[] = [];
            let busesPlate: Bus[] = [];

            // Validar número si se proporciona
            if (numero) {
                const responseNumberExist = await axiosClient.get<Bus[]>(`${API_ROUTES.BUSES.BASE}?numero=${numero}`);
                busesNumber = responseNumberExist.data.data;

                // Si encontramos buses con el mismo número, verificar que no sea el bus actual
                if (busId) {
                    busesNumber = busesNumber.filter(bus => bus.id !== busId);
                }
            }

            // Validar placa si se proporciona
            if (placa) {
                const responsePlateExist = await axiosClient.get<Bus[]>(`${API_ROUTES.BUSES.BASE}?placa=${placa}`);
                busesPlate = responsePlateExist.data.data;

                // Si encontramos buses con la misma placa, verificar que no sea el bus actual
                if (busId) {
                    busesPlate = busesPlate.filter(bus => bus.id !== busId);
                }
            }

            // Si no hay coincidencias después de filtrar el bus actual
            if (busesNumber.length === 0 && busesPlate.length === 0) {
                return { exists: false, field: null };
            }

            // Verificar coincidencias de número
            if (numero && busesNumber.length > 0) {
                return { exists: true, field: "numero" };
            }

            // Verificar coincidencias de placa
            if (placa && busesPlate.length > 0) {
                return { exists: true, field: "placa" };
            }

            return { exists: false, field: null };
        } catch (error) {
            console.error('Error validating bus:', error);
            throw error;
        }
    }
}; 