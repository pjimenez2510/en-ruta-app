import { API_ROUTES } from '@/core/constants/api-routes';
import { FloorTemplate } from '../interfaces/bus-template.interface';
import { createAuthApi } from '@/core/infrastructure/auth-axios';
import { ResponseAPI } from '@/core/interfaces/api.interface';
import { SeatTemplate } from '../interfaces/seat-template.interface';

export const BusTemplateService = {

    getAll: async (): Promise<FloorTemplate[]> => {
        try {
            const api = await createAuthApi();
            const response = await api.get<FloorTemplate[]>(API_ROUTES.BUS_TEMPLATES.FLOOR_TEMPLATE);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    getByBusModel: async (modeloBusId: number): Promise<FloorTemplate[]> => {
        try {
            const api = await createAuthApi();
            const { data } = await api.get<ResponseAPI<FloorTemplate[]>>(
                API_ROUTES.BUS_TEMPLATES.FLOOR_TEMPLATE,
                {
                    params: {
                        modeloBusId,
                    },
                }
            );
            return data.data;
        } catch (error) {
            console.error("Error al cargar plantilla", error);
            throw error;
        }
    },

    getSeatsByTemplate: async (plantillaPisoId: number): Promise<SeatTemplate[]> => {
        try {
            const api = await createAuthApi();
            const { data } = await api.get<ResponseAPI<SeatTemplate[]>>(
                API_ROUTES.BUS_TEMPLATES.GET_SEATS,
                {
                    params: {
                        plantillaPisoId,
                    },
                }
            );
            return data.data;
        } catch (error) {
            console.error("Error al obtener asientos de plantilla:", error);
            throw error;
        }
    },
}