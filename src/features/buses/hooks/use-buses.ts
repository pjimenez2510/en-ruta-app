'use client';

import { useEffect, useState, useCallback } from 'react';
import { BusService } from '../services/bus.service';
import { useSession } from 'next-auth/react';
import { Bus } from '../interfaces/bus.interface';
import { BusCreationData } from '../interfaces/seat-config';
import { toast } from 'sonner';

export const useBuses = () => {
    const { data: session } = useSession();
    const token = session?.user?.accessToken;
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBuses = useCallback(async () => {
        if (!token) {
            setError('No hay una sesión activa');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await BusService.getAll(token);
            if (Array.isArray(data)) {
                setBuses(data);
                setError(null);
            } else {
                console.error("Los datos recibidos no son un array:", data);
                setBuses([]);
                setError('Error en el formato de datos recibidos');
            }
        } catch (error) {
            console.error("Error fetching buses:", error);
            setError('Error al cargar los buses');
            toast.error('Error al cargar los buses');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchBuses();
        } else {
            setLoading(false);
        }
    }, [fetchBuses, token]);

    const getBusById = useCallback(async (id: string) => {
        if (!token) {
            throw new Error('No hay una sesión activa');
        }

        try {
            const bus = await BusService.getById(id, token);
            if (!bus) {
                throw new Error('No se encontró el bus');
            }
            return bus;
        } catch (error) {
            console.error("Error getting bus by id:", error);
            toast.error('Error al obtener los detalles del bus');
            throw error;
        }
    }, [token]);

    const createBus = async (data: BusCreationData) => {
        if (!token) {
            throw new Error('No hay una sesión activa');
        }

        try {
            const newBus = await BusService.create(data, token);
            if (newBus) {
                await fetchBuses();
                return newBus;
            }
            throw new Error('Error al crear el bus');
        } catch (error) {
            console.error("Error al crear el bus:", error);
            toast.error('Error al crear el bus');
            throw error;
        }
    };

    const updateBus = async (id: string, data: Partial<Bus>) => {
        if (!token) {
            throw new Error('No hay una sesión activa');
        }

        try {
            const updatedBus = await BusService.update(id, data, token);
            if (updatedBus) {
                await fetchBuses(); // Recargar la lista completa para tener datos actualizados
                return updatedBus;
            }
            throw new Error('Error al actualizar el bus');
        } catch (error) {
            console.error("Error al actualizar el bus:", error);
            toast.error('Error al actualizar el bus');
            throw error;
        }
    };

    const updateBusSeats = async (
        busId: string,
        seats: Array<{
            numeroPiso: number;
            asientos: Array<{
                numero: string;
                fila: number;
                columna: number;
                tipoId: number;
                estado: "DISPONIBLE" | "OCUPADO" | "MANTENIMIENTO";
            }>;
        }>
    ) => {
        if (!token) {
            throw new Error('No hay una sesión activa');
        }

        try {
            await BusService.updateSeats(busId, seats, token);
            await fetchBuses(); // Recargar la lista completa para tener datos actualizados
        } catch (error) {
            console.error("Error al actualizar los asientos:", error);
            toast.error('Error al actualizar los asientos');
            throw error;
        }
    };

    const setBusMantenimiento = async (id: string) => {
        if (!token) {
            throw new Error('No hay una sesión activa');
        }

        try {
            await BusService.setMantenimiento(id, token);
            setBuses(prevBuses =>
                prevBuses.map(bus =>
                    bus.id === id ? { ...bus, estado: "MANTENIMIENTO" } : bus
                )
            );
        } catch (error) {
            console.error("Error al cambiar el estado del bus a mantenimiento:", error);
            toast.error('Error al cambiar el estado del bus a mantenimiento');
            throw error;
        }
    };

    const setBusActivo = async (id: string) => {
        if (!token) {
            throw new Error('No hay una sesión activa');
        }

        try {
            await BusService.setActivo(id, token);
            setBuses(prevBuses =>
                prevBuses.map(bus =>
                    bus.id === id ? { ...bus, estado: "ACTIVO" } : bus
                )
            );
        } catch (error) {
            console.error("Error al cambiar el estado del bus a activo:", error);
            toast.error('Error al cambiar el estado del bus a activo');
            throw error;
        }
    };

    const setBusRetirado = async (id: string) => {
        if (!token) {
            throw new Error('No hay una sesión activa');
        }

        try {
            await BusService.setRetirado(id, token);
            setBuses(prevBuses =>
                prevBuses.map(bus =>
                    bus.id === id ? { ...bus, estado: "RETIRADO" } : bus
                )
            );
        } catch (error) {
            console.error("Error al cambiar el estado del bus a retirado:", error);
            toast.error('Error al cambiar el estado del bus a retirado');
            throw error;
        }
    };

    return {
        buses,
        loading,
        error,
        getBusById,
        createBus,
        updateBus,
        updateBusSeats,
        setBusMantenimiento,
        setBusActivo,
        setBusRetirado,
        fetchBuses
    };
}; 