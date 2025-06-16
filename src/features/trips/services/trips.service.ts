import { createAuthApi } from '@/core/infrastructure/auth-axios';
import { Trip } from '../interfaces/trips.interface';

const BASE_URL = '/viajes';

export const TripsService = {
  getAll: async (): Promise<Trip[]> => {
    const api = await createAuthApi();
    const response = await api.get(BASE_URL);
    return response.data.data;
  },

  getById: async (id: number): Promise<Trip> => {
    const api = await createAuthApi();
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (trip: Partial<Trip>): Promise<Trip> => {
    const api = await createAuthApi();
    const response = await api.post(BASE_URL, trip);
    return response.data;
  },

  update: async (id: number, trip: Partial<Trip>): Promise<Trip> => {
    const api = await createAuthApi();
    const response = await api.put(`${BASE_URL}/${id}`, trip);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const api = await createAuthApi();
    await api.delete(`${BASE_URL}/${id}`);
  }
};
