import { createAuthApi } from '@/core/infrastructure/auth-axios';
import { Trip, CreateTripDTO, TripFilters } from '../interfaces/trips.interface';

const BASE_URL = '/viajes';

export const TripsService = {  getAll: async (filters?: TripFilters): Promise<Trip[]> => {
    const api = await createAuthApi();
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const response = await api.get(url);
    console.log("Respuesta viajes:", response.data);

    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data.data)) return response.data.data;
    if (Array.isArray(response.data.results)) return response.data.results;
    return [];
  },

  getById: async (id: number): Promise<Trip> => {
    const api = await createAuthApi();
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },
  create: async (trip: CreateTripDTO): Promise<Trip> => {
    const api = await createAuthApi();
    const response = await api.post(BASE_URL, trip);
    return response.data;
  },

  update: async (id: number, trip: CreateTripDTO): Promise<Trip> => {
    const api = await createAuthApi();
    const response = await api.put(`${BASE_URL}/${id}`, trip);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const api = await createAuthApi();
    await api.delete(`${BASE_URL}/${id}`);
  }
};
