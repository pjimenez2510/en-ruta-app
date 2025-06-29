'use client';

import { useEffect, useState, useCallback } from 'react';
import { BusModelService } from '../services/bus-model.service';
import { BusModel } from '../interfaces/bus-model.interface';

// Cache global para modelos de buses
let busModelsCache: BusModel[] = [];
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useBusModels = () => {
    const [busModels, setBusModels] = useState<BusModel[]>(busModelsCache);
    const [loading, setLoading] = useState(!busModelsCache.length);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        busModelsCache = [];
        lastFetch = 0;
        fetchBusModels(true);
    }, []);

    const fetchBusModels = useCallback(async (force = false) => {
        // Si hay datos en caché y no ha pasado el tiempo de expiración, usar caché
        if (!force && busModelsCache.length > 0 && Date.now() - lastFetch < CACHE_DURATION) {
            setBusModels(busModelsCache);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await BusModelService.getAll();
            if (Array.isArray(data)) {
                busModelsCache = data;
                lastFetch = Date.now();
                setBusModels(data);
            } else {
                console.error("Los datos recibidos no son un array:", data);
                setBusModels([]);
            }
            setError(null);
        } catch (error) {
            console.error("Error al cargar los modelos de bus:", error);
            setError('Error al cargar los modelos de bus');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBusModelById = useCallback(async (id: number) => {
        // Intentar encontrar primero en el caché
        const cachedModel = busModelsCache.find(model => model.id === id);
        if (cachedModel) {
            return cachedModel;
        }

        try {
            const model = await BusModelService.getById(id);
            if (model) {
                // Actualizar el modelo en el caché si existe
                const modelIndex = busModelsCache.findIndex(m => m.id === id);
                if (modelIndex >= 0) {
                    busModelsCache[modelIndex] = model;
                } else {
                    busModelsCache.push(model);
                }
            }
            return model;
        } catch (error) {
            console.error("Error al obtener el modelo de bus:", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        fetchBusModels();
    }, [fetchBusModels]);

    return {
        busModels,
        loading,
        error,
        getBusModelById,
        refreshBusModels: () => fetchBusModels(true),
    };
}; 