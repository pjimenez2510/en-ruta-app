import axios, { AxiosInstance } from 'axios';
import { Bus } from "../interfaces/bus.interface";
import { BusCreationData } from '../interfaces/seat-config';
import { BusFloor } from '../interfaces/bus-floor.interface';
import { SeatUpdate } from '../interfaces/seat.interface';

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const BASE_URL = "/buses";

export const BusService = {
    getAll: async (token: string | null = null): Promise<Bus[]> => {
        const response = await api.get(BASE_URL, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }),
            },
        });
        return response.data.data;
    },

    getById: async (id: string, token: string | null = null): Promise<Bus | null> => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
            });

            // Obtener los pisos del bus
            const pisosResponse = await api.get(`/pisos-bus?busId=${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
            });

            // Obtener los asientos para cada piso
            const pisosConAsientos = await Promise.all(
                pisosResponse.data.data.map(async (piso: BusFloor) => {
                    const asientosResponse = await api.get(`/asientos?pisoBusId=${piso.id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && { "Authorization": `Bearer ${token}` }),
                        },
                    });
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

    create: async (data: BusCreationData, token: string | null = null): Promise<Bus | null> => {
        try {
            // 1. Crear el bus
            const busResponse = await api.post(BASE_URL, data.busInfo, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
            });

            const busId = busResponse.data.data.id;

            // 2. Crear los pisos uno por uno
            for (const piso of data.pisos) {
                const pisoResponse = await api.post(`/pisos-bus`, {
                    busId,
                    numeroPiso: piso.numeroPiso,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` }),
                    },
                });

                const pisoBusId = pisoResponse.data.data.id;

                // 3. Crear los asientos de manera masiva para cada piso
                if (piso.asientos.length > 0) {
                    await api.post(`/asientos/masivo`, {
                        pisoBusId,
                        asientos: piso.asientos.map(asiento => ({
                            ...asiento,
                            estado: "DISPONIBLE"
                        }))
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && { "Authorization": `Bearer ${token}` }),
                        },
                    });
                }
            }

            return busResponse.data;
        } catch (error) {
            console.error('Error creating bus:', error);
            throw error;
        }
    },

    update: async (id: string, busData: Partial<Bus>, token: string | null = null): Promise<Bus | null> => {
        try {
            const response = await api.put(`${BASE_URL}/${id}`, busData, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
            });

            return response.data;
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
        }>,
        token: string | null = null
    ): Promise<void> => {
        for (const piso of seats) {
            await api.put(`${BASE_URL}/${busId}/pisos/${piso.numeroPiso}/asientos`, {
                asientos: piso.asientos
            }, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
            });
        }
    },

    updateSingleSeat: async (
        seatId: number,
        seatData: SeatUpdate,
        token: string | null = null
    ): Promise<void> => {
        try {
            console.log('Updating seat:', seatData);
            await api.put(`/asientos/${seatId}`, seatData, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
            });
        } catch (error) {
            console.error('Error updating seat:', error);
            throw error;
        }
    },

    setMantenimiento: async (id: string, token: string | null = null): Promise<boolean> => {
        await api.put(`${BASE_URL}/${id}/mantenimiento`, {}, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }),
            },
        });
        return true;
    },

    setActivo: async (id: string, token: string | null = null): Promise<boolean> => {
        await api.put(`${BASE_URL}/${id}/activar`, {}, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }),
            },
        });
        return true;
    },

    setRetirado: async (id: string, token: string | null = null): Promise<boolean> => {
        await api.put(`${BASE_URL}/${id}/retirar`, {}, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }),
            },
        });
        return true;
    },

    validateBusExists: async (
        numero?: number,
        placa?: string,
        busId?: string,
        token: string | null = null
    ): Promise<{ exists: boolean; field: "numero" | "placa" | null }> => {
        try {
            let busesNumber: Bus[] = [];
            let busesPlate: Bus[] = [];

            // Validar número si se proporciona
            if (numero) {
                const responseNumberExist = await api.get(`${BASE_URL}?numero=${numero}`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` }),
                    },
                });
                busesNumber = responseNumberExist.data.data;

                // Si encontramos buses con el mismo número, verificar que no sea el bus actual
                if (busId) {
                    busesNumber = busesNumber.filter(bus => bus.id !== busId);
                }
            }

            // Validar placa si se proporciona
            if (placa) {
                const responsePlateExist = await api.get(`${BASE_URL}?placa=${placa}`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` }),
                    },
                });
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