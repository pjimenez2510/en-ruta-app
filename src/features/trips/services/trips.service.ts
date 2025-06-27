import { createAuthApi } from '@/core/infrastructure/auth-axios';
import { Trip, CreateTripDTO, TripFilters } from '../interfaces/trips.interface';

const BASE_URL = '/viajes';

export const TripsService = {
  getAll: async (filters?: TripFilters): Promise<Trip[]> => {
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
   
    console.log('=== TRIPS SERVICE DEBUG ===');
    console.log('URL final:', url);
    console.log('Filtros enviados:', filters);
    console.log('Query params:', queryString);
    
    try {
      const response = await api.get(url);
      console.log('Respuesta completa:', response);
      console.log('Respuesta data:', response.data);
      console.log('Status:', response.status);
      
      // Verificar estructura de la respuesta
      let trips: Trip[] = [];
      
      if (Array.isArray(response.data)) {
        trips = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        trips = response.data.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        trips = response.data.results;
      } else {
        console.warn('Estructura de respuesta no reconocida:', response.data);
        trips = [];
      }
      
      console.log('Trips procesados:', trips);
      console.log('Cantidad de trips:', trips.length);
      console.log('==========================');
      
      return trips;
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
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