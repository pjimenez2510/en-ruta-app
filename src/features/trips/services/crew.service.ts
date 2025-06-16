import { createAuthApi } from '@/core/infrastructure/auth-axios';
import { RouteSchedule, Bus, CrewMember } from '../interfaces/crew.interface';

const ensureArray = <T>(data: T | T[] | null | undefined): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

export const CrewService = {
  getSchedules: async (): Promise<RouteSchedule[]> => {
    try {
      const api = await createAuthApi();
      console.log('Fetching schedules...');
      const response = await api.get('https://en-ruta-api.onrender.com/horarios-ruta');
      console.log('Raw API response:', response);
      
      // Handle both array responses and data-wrapped responses
      const schedules = response.data.data || response.data;
      console.log('Processed schedules:', schedules);
      
      return ensureArray(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      console.error('API URL:', process.env.NEXT_PUBLIC_API_URL);
      return [];
    }
  },

  getBuses: async (): Promise<Bus[]> => {
    try {
      console.log('Fetching buses...');
      const api = await createAuthApi();
      const response = await api.get('https://en-ruta-api.onrender.com/buses');
      console.log('Raw bus response:', response);
      
      // Handle the wrapped data response
      const buses = response.data.data || response.data;
      console.log('Processed buses:', buses);
      
      return ensureArray(buses);
    } catch (error) {
      console.error('Error fetching buses:', error);
      return [];
    }
  },

  getDrivers: async (): Promise<CrewMember[]> => {
    try {
      const api = await createAuthApi();
      const response = await api.get('/usuario-tenant', {
        params: { rol: 'CONDUCTOR' }
      });
      return ensureArray(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      return [];
    }
  },

  getHelpers: async (): Promise<CrewMember[]> => {
    try {
      const api = await createAuthApi();
      const response = await api.get('/usuario-tenant', {
        params: { rol: 'AYUDANTE' }
      });
      return ensureArray(response.data);
    } catch (error) {
      console.error('Error fetching helpers:', error);
      return [];
    }
  }
};
