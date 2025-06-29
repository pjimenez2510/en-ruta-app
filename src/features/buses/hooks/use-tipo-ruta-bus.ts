'use client';

import { useEffect, useState, useCallback } from 'react';
import { TipoRutaBusService } from '@/features/tipos-ruta-bus/services/tipo-ruta-bus.service';
import { TipoRutaBus } from '@/features/tipos-ruta-bus/interfaces/tipo-ruta-bus.interface';

// Cache global para tipos de ruta
let tiposRutaCache: TipoRutaBus[] = [];
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useTipoRutaBus = () => {
    const [tiposRuta, setTiposRuta] = useState<TipoRutaBus[]>(tiposRutaCache);
    const [loading, setLoading] = useState(!tiposRutaCache.length);
    const [error, setError] = useState<string | null>(null);

    const fetchTiposRuta = useCallback(async (force = false) => {
        // Si hay datos en caché y no ha pasado el tiempo de expiración, usar caché
        if (!force && tiposRutaCache.length > 0 && Date.now() - lastFetch < CACHE_DURATION) {
            setTiposRuta(tiposRutaCache);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const service = TipoRutaBusService.getInstance();
            const data = await service.findAll();

            if (Array.isArray(data)) {
                tiposRutaCache = data;
                lastFetch = Date.now();
                setTiposRuta(data);
                setError(null);
            } else {
                console.error("Los datos recibidos no son un array:", data);
                setTiposRuta([]);
                setError('Error en el formato de datos recibidos');
            }
        } catch (error) {
            console.error("Error al cargar los tipos de ruta:", error);
            setError('Error al cargar los tipos de ruta');
            setTiposRuta([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTiposRuta();
    }, [fetchTiposRuta]);

    return {
        tiposRuta,
        loading,
        error,
        refreshTiposRuta: () => fetchTiposRuta(true),
    };
}; 