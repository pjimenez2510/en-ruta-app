import { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export interface ResponseAPI<T> {
  message: string
  data: T
  errors?: string[] | string
}

export interface ResponseErrorAPI {
  message: string
  errors?: string[] | string
}

export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  skipAuth?: boolean
}

export interface CustomInternalAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  skipAuth?: boolean
}

export type ExtractData<T> = T extends ResponseAPI<infer D> ? D : never
