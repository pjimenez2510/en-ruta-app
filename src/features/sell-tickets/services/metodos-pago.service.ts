import { API_ROUTES } from '@/core/constants/api-routes';
import AxiosClient from '@/core/infrastructure/axios-client';
import { MetodoPago, MetodoPagoResponse } from '../interfaces/metodo-pago.interface';

export async function getMetodosPago(): Promise<MetodoPago[]> {
  const client = AxiosClient.getInstance();
  const { data } = await client.get<MetodoPagoResponse>(API_ROUTES.METODOS_PAGO.GET_ALL);
  return (data.data || []).filter((m) => m.activo);
} 