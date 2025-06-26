import AxiosClient from "@/core/infrastructure/axios-client";

export interface CreateHorarioRutaDto {
  rutaId: number;
  horaSalida: string;
  diasSemana: string;
  activo?: boolean;
}

export interface UpdateHorarioRutaDto {
  rutaId?: number;
  horaSalida?: string;
  diasSemana?: string;
  activo?: boolean;
}

export interface HorarioResponse {
  id: number;
  rutaId: number;
  horaSalida: string;
  diasSemana: string;
  activo: boolean;
}

const axiosClient = AxiosClient.getInstance();

export const horarioService = {
  getHorarios: async (rutaId: number): Promise<HorarioResponse[]> => {
    try {
      console.log('=== Obtener Horarios Service ===');
      const url = `/horarios-ruta?rutaId=${rutaId}`;
      console.log('URL:', url);
      
      const { data } = await axiosClient.get<HorarioResponse[]>(url);
      console.log('Respuesta:', data);
      return data.data;
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      throw error;
    }
  },

  getAllHorarios: async (): Promise<HorarioResponse[]> => {
    try {
      console.log('=== Obtener Todos los Horarios Service ===');
      const url = `/horarios-ruta`;
      console.log('URL:', url);
      
      const { data } = await axiosClient.get<HorarioResponse[]>(url);
      console.log('Respuesta:', data);
      return data.data;
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      throw error;
    }
  },

  createHorario: async (horario: CreateHorarioRutaDto): Promise<HorarioResponse> => {
    try {
      console.log('=== Crear Horario Service ===');
      console.log('Data a enviar:', horario);
      
      const createHorarioDto: CreateHorarioRutaDto = {
        rutaId: horario.rutaId,
        horaSalida: horario.horaSalida,
        diasSemana: horario.diasSemana,
        activo: horario.activo ?? true
      };
      
      const { data } = await axiosClient.post<HorarioResponse>('/horarios-ruta', createHorarioDto);
      console.log('Respuesta del servidor:', data);
      return data.data;
    } catch (error) {
      console.error('Error al crear horario:', error);
      throw error;
    }
  },

  updateHorario: async (id: number, horario: UpdateHorarioRutaDto): Promise<HorarioResponse> => {
    try {
      console.log('=== Actualizar Horario Service ===');
      const url = `/horarios-ruta/${id}`;
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
      const url = `/horarios-ruta/${id}`;
      console.log('URL:', url);
      
      await axiosClient.delete(url);
      console.log('Horario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      throw error;
    }
  },
};
