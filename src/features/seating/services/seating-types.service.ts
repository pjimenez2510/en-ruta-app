import { SeatingTypes, SeatingTypesCreate, SeatingTypesUpdate } from '@/features/auth/interfaces/seating-type.interface';
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAll = async (): Promise<SeatingTypes[]> => {
    try {
        const response: AxiosResponse<SeatingTypes[]> = await api.get('/seating-types');
        return response.data;
    } catch (error) {
        handleError(error);
        return [];
    }
};

export const getById = async (id: string): Promise<SeatingTypes | null> => {
    try {
        const response: AxiosResponse<SeatingTypes> = await api.get(`/seating-types/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};


const handleError = (error: unknown): void => {
    if (axios.isAxiosError(error)) {
        console.error('Error en la solicitud HTTP:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
        });
    } else {
        console.error('Error desconocido:', error);
    }
};

export { api as seatingTypesApi };