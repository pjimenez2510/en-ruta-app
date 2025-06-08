import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { SeatType } from '../interfaces/seat-type.interface';

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAll = async (token: string | null = null): Promise<SeatType[]> => {
    try {
        const response = await api.get('/tipo-asientos', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.data.data;
    } catch (error) {
        handleError(error);
        return [];
    }
};

export const getById = async (id: number, token: string | null = null): Promise<SeatType | null> => {
    try {
        const response: any = await api.get(`/tipo-asientos/${id}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const createSeatingType = async (seatingTypeData: any, token: string | null = null): Promise<SeatType | null> => {
    try {
        const response: any = await api.post('/tipo-asientos', seatingTypeData, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const updateSeatingType = async (seatingTypeData: any, id: number, token: string | null = null): Promise<SeatType | null> => {
    try {
        const response: any = await api.put(`/tipo-asientos/${id}`, seatingTypeData, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const deactivateSeatType = async (id: number, token: string | null = null): Promise<boolean> => {
    try {
        await api.delete(`/tipo-asientos/${id}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
};

const handleError = (error: unknown): void => {
    if (axios.isAxiosError(error)) {
        console.error('Error de solicitud:', {
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