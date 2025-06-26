'use client';

import { useEffect, useState, useCallback } from 'react';
import { BusService } from '../services/bus.service';
import { Bus } from '../interfaces/bus.interface';
import { BusCreationData } from '../interfaces/seat-config';
import { toast } from 'sonner';
import { SeatUpdate } from '../interfaces/seat.interface';

// Cache global para buses
let busesCache: Bus[] = [];
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Cache para buses individuales
const busDetailsCache: { [key: string]: { bus: Bus, timestamp: number } } = {};

export const useBuses = () => {
    const [buses, setBuses] = useState<Bus[]>(busesCache);
    const [loading, setLoading] = useState(!busesCache.length);
    const [error, setError] = useState<string | null>(null);

    // Limpiar el caché cuando cambia la sesión
    useEffect(() => {
        busesCache = [];
        lastFetch = 0;
        fetchBuses(true);
    }, []);

    const fetchBuses = useCallback(async (force = false) => {
        // Si hay datos en caché y no ha pasado el tiempo de expiración, usar caché
        if (!force && busesCache.length > 0 && Date.now() - lastFetch < CACHE_DURATION) {
            setBuses(busesCache);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await BusService.getAll();
            if (Array.isArray(data)) {
                busesCache = data;
                lastFetch = Date.now();
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
            toast.error('Error al cargar los buses', {
                description: 'No se pudieron obtener los datos de los buses. Por favor, intente nuevamente.'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const getBusById = useCallback(async (id: string) => {
        // Verificar caché de detalles
        const cachedBus = busDetailsCache[id];
        if (cachedBus && Date.now() - cachedBus.timestamp < CACHE_DURATION) {
            return cachedBus.bus;
        }

        try {
            const bus = await BusService.getById(id);
            if (!bus) {
                throw new Error('No se encontró el bus');
            }

            // Actualizar caché
            busDetailsCache[id] = {
                bus,
                timestamp: Date.now()
            };

            return bus;
        } catch (error) {
            console.error("Error getting bus by id:", error);
            toast.error('Error al obtener los detalles del bus', {
                description: 'No se pudieron cargar los detalles del bus. Por favor, intente nuevamente.'
            });
            throw error;
        }
    }, []);

    const createBus = async (data: BusCreationData) => {
        try {
            const newBus = await BusService.create(data);
            if (newBus) {
                await fetchBuses(true); // Forzar actualización del caché
                toast.success('Bus creado exitosamente', {
                    description: `El bus número ${data.busInfo.numero} ha sido creado correctamente.`
                });
                return newBus;
            }
            throw new Error('Error al crear el bus');
        } catch (error) {
            console.error("Error al crear el bus:", error);
            toast.error('Error al crear el bus', {
                description: 'No se pudo crear el bus. Por favor, verifique los datos e intente nuevamente.'
            });
            throw error;
        }
    };

    const updateBus = async (id: string, data: Partial<Bus>) => {
        try {
            const updatedBus = await BusService.update(id, data);
            if (updatedBus) {
                // Actualizar ambos cachés
                delete busDetailsCache[id];
                await fetchBuses(true);

                toast.success('Bus actualizado exitosamente', {
                    description: `La información del bus ha sido actualizada correctamente.`
                });
                return updatedBus;
            }
            throw new Error('Error al actualizar el bus');
        } catch (error) {
            console.error("Error al actualizar el bus:", error);
            toast.error('Error al actualizar el bus', {
                description: 'No se pudo actualizar la información del bus. Por favor, intente nuevamente.'
            });
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
        try {
            await BusService.updateSeats(busId, seats);
            // Invalidar caché de detalles para este bus
            delete busDetailsCache[busId];

            // Actualizar el bus en el caché global
            const updatedBus = await getBusById(busId);
            if (updatedBus) {
                setBuses(prevBuses =>
                    prevBuses.map(bus =>
                        bus.id === busId ? updatedBus : bus
                    )
                );
            }

            toast.success('Asientos actualizados exitosamente', {
                description: 'La configuración de asientos ha sido actualizada correctamente.'
            });
        } catch (error) {
            console.error("Error al actualizar los asientos:", error);
            toast.error('Error al actualizar los asientos', {
                description: 'No se pudo actualizar la configuración de asientos. Por favor, intente nuevamente.'
            });
            throw error;
        }
    };

    const updateSingleSeat = async (seatId: number, seatData: SeatUpdate) => {
        try {
            await BusService.updateSingleSeat(seatId, seatData);

            // Limpiar todo el caché de detalles
            Object.keys(busDetailsCache).forEach(key => {
                delete busDetailsCache[key];
            });

            // Limpiar caché global y forzar recarga
            busesCache = [];
            lastFetch = 0;
            await fetchBuses(true);

            toast.success('Asiento actualizado', {
                description: `El asiento ${seatData.numero} ha sido actualizado correctamente.`
            });
        } catch (error) {
            console.error("Error al actualizar el asiento:", error);
            toast.error('Error al actualizar el asiento', {
                description: 'No se pudo actualizar el asiento. Por favor, intente nuevamente.'
            });
            throw error;
        }
    };

    const setBusMantenimiento = async (id: string) => {
        try {
            await BusService.setMantenimiento(id);
            setBuses(prevBuses =>
                prevBuses.map(bus =>
                    bus.id === id ? { ...bus, estado: "MANTENIMIENTO" } : bus
                )
            );
            // Invalidar caché de detalles
            delete busDetailsCache[id];

            toast.success('Estado actualizado', {
                description: 'El bus ha sido puesto en mantenimiento.'
            });
        } catch (error) {
            console.error("Error al cambiar el estado del bus a mantenimiento:", error);
            toast.error('Error al cambiar el estado', {
                description: 'No se pudo cambiar el estado del bus a mantenimiento. Por favor, intente nuevamente.'
            });
            throw error;
        }
    };

    const setBusActivo = async (id: string) => {
        try {
            await BusService.setActivo(id);
            setBuses(prevBuses =>
                prevBuses.map(bus =>
                    bus.id === id ? { ...bus, estado: "ACTIVO" } : bus
                )
            );
            // Invalidar caché de detalles
            delete busDetailsCache[id];

            toast.success('Estado actualizado', {
                description: 'El bus ha sido activado correctamente.'
            });
        } catch (error) {
            console.error("Error al cambiar el estado del bus a activo:", error);
            toast.error('Error al cambiar el estado', {
                description: 'No se pudo activar el bus. Por favor, intente nuevamente.'
            });
            throw error;
        }
    };

    const setBusRetirado = async (id: string) => {
        try {
            await BusService.setRetirado(id);
            setBuses(prevBuses =>
                prevBuses.map(bus =>
                    bus.id === id ? { ...bus, estado: "RETIRADO" } : bus
                )
            );
            // Invalidar caché de detalles
            delete busDetailsCache[id];

            toast.success('Estado actualizado', {
                description: 'El bus ha sido retirado de servicio.'
            });
        } catch (error) {
            console.error("Error al cambiar el estado del bus a retirado:", error);
            toast.error('Error al cambiar el estado', {
                description: 'No se pudo retirar el bus. Por favor, intente nuevamente.'
            });
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
        updateSingleSeat,
        setBusMantenimiento,
        setBusActivo,
        setBusRetirado
    };
}; 