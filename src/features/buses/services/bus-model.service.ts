import axios, { AxiosInstance } from 'axios';
import { BusModel } from '../interfaces/bus-model.interface';

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const BASE_URL = "/modelos-bus";

export const BusModelService = {
    getAll: async (token: string | null = null): Promise<BusModel[]> => {
        const response = await api.get(BASE_URL, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }),
            },
        });
        return response.data.data;
    },

    getById: async (id: number, token: string | null = null): Promise<BusModel | null> => {
        const response = await api.get(`${BASE_URL}/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }),
            },
        });
        return response.data;
    },
}; 