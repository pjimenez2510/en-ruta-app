'use client';

import { useEffect, useState } from 'react';
import { BusModelService } from '../services/bus-model.service';
import { useSession } from 'next-auth/react';

interface BusModel {
    id: number;
    marca: string;
    modelo: string;
    tipoChasis: string;
    tipoCarroceria: string;
    numeroPisos: number;
}

export const useBusModels = () => {
    const [busModels, setBusModels] = useState<BusModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const token = (session?.user?.accessToken as string) || null;

    const fetchBusModels = async () => {
        try {
            setLoading(true);
            const data = await BusModelService.getAll(token);
            if (Array.isArray(data)) {
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
    };

    const getBusModelById = async (id: number) => {
        try {
            return await BusModelService.getById(id, token);
        } catch (error) {
            console.error("Error al obtener el modelo de bus:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (token) {
            fetchBusModels();
        }
    }, [token]);

    return {
        busModels,
        loading,
        error,
        getBusModelById,
        refreshBusModels: fetchBusModels,
    };
}; 