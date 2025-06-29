import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";
import { ResponseAPI } from "@/core/interfaces/api.interface";
import {
  CrearVentaData,
  Venta,
} from "@/features/sell-tickets/interfaces/venta.interface";
import { VentaLista } from "@/features/sell-tickets/interfaces/venta-lista.interface";

export async function crearVenta(ventaData: CrearVentaData): Promise<Venta> {
  const client = AxiosClient.getInstance();
  const { data }: { data: ResponseAPI<Venta> } = await client.post(
    API_ROUTES.VENTAS.POST,
    ventaData
  );
  return data.data;
}

export async function getVentas(params?: {
  fechaVenta?: string;
  fechaVentaDesde?: string;
  fechaVentaHasta?: string;
}): Promise<VentaLista[]> {
  const client = AxiosClient.getInstance();
  const { data } = await client.get(API_ROUTES.VENTAS.GET_ALL, { params });
  return data.data as VentaLista[];
}
