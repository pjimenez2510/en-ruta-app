import AxiosClient from "@/core/infrastructure/axios-client";

export interface CreateHorarioDto {
  rutaId: number;
  horaSalida: string;
  diasSemana: string;
  activo: boolean;
}

export interface UpdateHorarioDto extends CreateHorarioDto {
  id: number;
}

export interface HorarioResponse extends CreateHorarioDto {
  id: number;
}

const axiosClient = AxiosClient.getInstance();

import { API_ROUTES } from "@/core/constants/api-routes";

export const horarioService = {
  getHorarios: async (rutaId: number): Promise<HorarioResponse[]> => {
    try {
      console.log('=== Obtener Horarios Service ===');
      console.log('URL:', API_ROUTES.HORARIOS.GET_BY_RUTA.replace(':rutaId', rutaId.toString()));
      
      const { data } = await axiosClient.get<HorarioResponse[]>(
        API_ROUTES.HORARIOS.GET_BY_RUTA.replace(':rutaId', rutaId.toString())
      );
      console.log('Respuesta:', data);
      return data.data;
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      throw error;
    }
  },
  createHorario: async (horario: CreateHorarioDto): Promise<HorarioResponse> => {
    try {
      console.log('=== Crear Horario Service ===');
      console.log('URL base:', process.env.NEXT_PUBLIC_BACKEND_API_URL);
      console.log('Ruta:', API_ROUTES.HORARIOS.CREATE);
      console.log('URL completa:', `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${API_ROUTES.HORARIOS.CREATE}`);
      console.log('Data a enviar:', {
        rutaId: horario.rutaId,
        horaSalida: horario.horaSalida,
        diasSemana: horario.diasSemana,
        activo: horario.activo
      });
      
      const { data } = await axiosClient.post<HorarioResponse>(
        API_ROUTES.HORARIOS.CREATE,
        {
          rutaId: horario.rutaId,
          horaSalida: horario.horaSalida,
          diasSemana: horario.diasSemana,
          activo: true
        }
      );
      console.log('Respuesta del servidor:', data);
      return data.data;
    } catch (error) {
      console.error('Error al crear horario:', error);
      throw error;
    }
  },

  updateHorario: async (id: number, horario: CreateHorarioDto): Promise<HorarioResponse> => {
    try {
      console.log('=== Actualizar Horario Service ===');
      const url = API_ROUTES.HORARIOS.UPDATE.replace(':id', id.toString());
      console.log('URL:', url);
      console.log('Data:', horario);
      
      const { data } = await axiosClient.put<HorarioResponse>(url, horario);
      console.log('Respuesta:', data);
      return data.data;
    } catch (error) {
      console.error('Error al actualizar horario:', error);
      throw error;
    }
  },

  deleteHorario: async (id: number): Promise<void> => {
    try {
      console.log('=== Eliminar Horario Service ===');
      const url = API_ROUTES.HORARIOS.DELETE.replace(':id', id.toString());
      console.log('URL:', url);
      
      await axiosClient.delete(url);
      console.log('Horario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      throw error;
    }
  },
};
