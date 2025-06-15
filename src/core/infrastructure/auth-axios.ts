// src/core/infrastructure/auth-axios.ts
import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

export const createAuthApi = async (): Promise<AxiosInstance> => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Solo en el cliente
  if (typeof window !== 'undefined') {
    const session = await getSession();
    
    if (session?.user?.accessToken) {
      instance.interceptors.request.use((config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${session.user.accessToken}`;
        }
        return config;
      });
    }
  }

  return instance;
};