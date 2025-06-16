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

export const horarioService = {
  getHorarios: async (rutaId: number): Promise<HorarioResponse[]> => {
    const { data } = await axiosClient.get<HorarioResponse[]>(`/horarios-ruta?rutaId=${rutaId}`);
    return data.data;
  },

  createHorario: async (horario: CreateHorarioDto): Promise<HorarioResponse> => {
    const { data } = await axiosClient.post<HorarioResponse>('/horarios-ruta', horario);
    return data.data;
  },

  updateHorario: async (id: number, horario: CreateHorarioDto): Promise<HorarioResponse> => {
    const { data } = await axiosClient.put<HorarioResponse>(`/horarios-ruta/${id}`, horario);
    return data.data;
  },

  deleteHorario: async (id: number): Promise<void> => {
    await axiosClient.delete(`/horarios-ruta/${id}`);
  },
};
