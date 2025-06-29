import { API_ROUTES } from '@/core/constants/api-routes';
import AxiosClient from '@/core/infrastructure/axios-client';
import { BusModel } from '../interfaces/bus-model.interface';

const axiosClient = AxiosClient.getInstance();

export const BusModelService = {
    getAll: async (): Promise<BusModel[]> => {
        const response = await axiosClient.get<BusModel[]>(API_ROUTES.BUSES.MODELOS);
        return response.data.data;
    },

    getById: async (id: number): Promise<BusModel | null> => {
        const response = await axiosClient.get<BusModel>(`${API_ROUTES.BUSES.MODELOS}/${id}`);
        return response.data.data;
    },
}; 