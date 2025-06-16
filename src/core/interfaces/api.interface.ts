import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export interface ResponseAPI<T> {
  data: T;
  message: string | null;
  statusCode: number;
  error?: string[] | string;
}

export interface ResponseErrorAPI {
  message: string;
  error?: string[] | string;
  statusCode: number;
}

export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  skipAuth?: boolean;
}

export interface CustomInternalAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}

export type ExtractData<T> = T extends ResponseAPI<infer D> ? D : never;
