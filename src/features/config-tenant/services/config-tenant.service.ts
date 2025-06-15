import axios ,{ AxiosInstance } from "axios";
import {Tenant} from "../interfaces/tenant.interface";
import { API_ROUTES } from "@/core/constants/api-routes";

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAll = async (token: string | null = null): Promise<Tenant[]> => {
    try {
        const response = await api.get(API_ROUTES.TENANTS.GET_ALL, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener la tenant:', error);
        return [];
    }
};