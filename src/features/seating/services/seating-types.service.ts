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

export const createSeatingType = async (seatingTypeData: SeatingTypesCreate): Promise<SeatingTypes | null> => {
    try {
        const response: AxiosResponse<SeatingTypes> = await api.post('/seating-types', seatingTypeData);
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const updateSeatingType = async ({ id, ...seatingTypeData }: SeatingTypesUpdate): Promise<SeatingTypes | null> => {
    try {
        const response: AxiosResponse<SeatingTypes> = await api.put(`/seating-types/${id}`, seatingTypeData);
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const deleteSeatType = async (id: string): Promise<boolean> => {
    try {
        await api.delete(`/seating-types/${id}`);
        return true;
    } catch (error) {
        handleError(error);
        return false;
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