'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BusTemplateService } from '../services/bus-template.service';
import { FloorTemplate } from '../interfaces/bus-template.interface';
import { SeatTemplate } from '../interfaces/seat-template.interface';
import { toast } from 'sonner';

// Cache global para plantillas
let templatesCache: FloorTemplate[] = [];
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Cache para asientos de plantillas
const seatsCache: { [key: number]: { seats: SeatTemplate[], timestamp: number } } = {};

// Sistema de notificación centralizada
let connectionErrorShown = false;
const showConnectionError = () => {
    if (!connectionErrorShown) {
        connectionErrorShown = true;
        toast.error('Error de conexión', {
            description: 'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.',
            duration: 5000,
        });
        // Resetear después de 10 segundos para permitir futuras notificaciones
        setTimeout(() => {
            connectionErrorShown = false;
        }, 10000);
    }
};

export const useBusTemplate = () => {
    const [templates, setTemplates] = useState<FloorTemplate[]>(templatesCache);
    const [loading, setLoading] = useState(!templatesCache.length);
    const [error, setError] = useState<string | null>(null);
    const [loadingSeats, setLoadingSeats] = useState<{ [key: number]: boolean }>({});
    const { data: session } = useSession();

    // Limpiar caché
    const clearCache = useCallback(() => {
        templatesCache = [];
        lastFetch = 0;
        Object.keys(seatsCache).forEach(key => {
            delete seatsCache[parseInt(key)];
        });
    }, []);

    // Limpiar caché cuando cambia la sesión (login/logout)
    useEffect(() => {
        if (!session) {
            clearCache();
            setTemplates([]);
            setLoading(false);
            setError(null);
            setLoadingSeats({});
        }
    }, [session, clearCache]);

    // Cargar asientos de una plantilla específica
    const fetchSeatsByTemplate = useCallback(async (plantillaPisoId: number, force = false) => {
        // Verificar caché de asientos
        const cachedSeats = seatsCache[plantillaPisoId];
        if (!force && cachedSeats && Date.now() - cachedSeats.timestamp < CACHE_DURATION) {
            return cachedSeats.seats;
        }

        try {
            setLoadingSeats(prev => ({ ...prev, [plantillaPisoId]: true }));
            const seats = await BusTemplateService.getSeatsByTemplate(plantillaPisoId);

            // Actualizar caché
            seatsCache[plantillaPisoId] = {
                seats,
                timestamp: Date.now()
            };

            return seats;
        } catch (error) {
            console.error("Error fetching seats by template:", error);
            // Mostrar notificación centralizada de error de conexión
            showConnectionError();
            throw error;
        } finally {
            setLoadingSeats(prev => ({ ...prev, [plantillaPisoId]: false }));
        }
    }, []);

    // Cargar plantillas por modelo de bus
    const fetchTemplatesByBusModel = useCallback(async (modeloBusId: number, force = false) => {
        // Si force es true, limpiar el estado actual
        if (force) {
            setTemplates([]);
        }

        try {
            setLoading(true);
            setError(null);
            const templatesData = await BusTemplateService.getByBusModel(modeloBusId);

            if (!Array.isArray(templatesData)) {
                console.error("Los datos recibidos no son un array:", templatesData);
                setTemplates([]);
                setError('Error en el formato de datos recibidos');
                return;
            }

            // Cargar asientos para cada plantilla
            const templatesWithSeats = await Promise.all(
                templatesData.map(async (template) => {
                    try {
                        const seats = await fetchSeatsByTemplate(template.id, force);
                        return {
                            ...template,
                            seats
                        };
                    } catch (error) {
                        console.error(`Error loading seats for template ${template.id}:`, error);
                        return {
                            ...template,
                            seats: []
                        };
                    }
                })
            );

            setTemplates(templatesWithSeats);
        } catch (error) {
            console.error("Error fetching templates by bus model:", error);
            setError('Error al cargar las plantillas del modelo de bus');
            // Mostrar notificación centralizada de error de conexión
            showConnectionError();
        } finally {
            setLoading(false);
        }
    }, [fetchSeatsByTemplate]);

    // Cargar todas las plantillas
    const fetchTemplates = useCallback(async (force = false) => {
        // Si hay datos en caché y no ha pasado el tiempo de expiración, usar caché
        if (!force && templatesCache.length > 0 && Date.now() - lastFetch < CACHE_DURATION) {
            setTemplates(templatesCache);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await BusTemplateService.getAll();

            if (Array.isArray(data)) {
                templatesCache = data;
                lastFetch = Date.now();
                setTemplates(data);
            } else {
                console.error("Los datos recibidos no son un array:", data);
                setTemplates([]);
                setError('Error en el formato de datos recibidos');
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
            setError('Error al cargar las plantillas de buses');
            // Mostrar notificación centralizada de error de conexión
            showConnectionError();
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar plantillas con sus asientos completos
    const fetchTemplatesWithSeats = useCallback(async (modeloBusId?: number, force = false) => {
        try {
            setLoading(true);
            setError(null);
            const templatesData = modeloBusId
                ? await BusTemplateService.getByBusModel(modeloBusId)
                : await BusTemplateService.getAll();

            if (!Array.isArray(templatesData)) {
                console.error("Los datos recibidos no son un array:", templatesData);
                setTemplates([]);
                setError('Error en el formato de datos recibidos');
                return;
            }

            // Cargar asientos para cada plantilla
            const templatesWithSeats = await Promise.all(
                templatesData.map(async (template) => {
                    try {
                        const seats = await fetchSeatsByTemplate(template.id, force);
                        return {
                            ...template,
                            seats
                        };
                    } catch (error) {
                        console.error(`Error loading seats for template ${template.id}:`, error);
                        return {
                            ...template,
                            seats: []
                        };
                    }
                })
            );

            setTemplates(templatesWithSeats);
        } catch (error) {
            console.error("Error fetching templates with seats:", error);
            setError('Error al cargar las plantillas con asientos');
            // Mostrar notificación centralizada de error de conexión
            showConnectionError();
        } finally {
            setLoading(false);
        }
    }, [fetchSeatsByTemplate]);

    // Verificar si se están cargando asientos para una plantilla específica
    const isLoadingSeats = useCallback((plantillaPisoId: number) => {
        return loadingSeats[plantillaPisoId] || false;
    }, [loadingSeats]);

    // Obtener plantilla por ID
    const getTemplateById = useCallback((id: number) => {
        return templates.find(template => template.id === id);
    }, [templates]);

    // Obtener plantillas por número de piso
    const getTemplatesByFloorNumber = useCallback((numeroPiso: number) => {
        return templates.filter(template => template.numeroPiso === numeroPiso);
    }, [templates]);

    return {
        // Estado
        templates,
        loading,
        error,
        loadingSeats,

        // Métodos principales
        fetchTemplates,
        fetchTemplatesByBusModel,
        fetchSeatsByTemplate,
        fetchTemplatesWithSeats,

        // Métodos de utilidad
        clearCache,
        isLoadingSeats,
        getTemplateById,
        getTemplatesByFloorNumber,

        // Estado de carga específico
        isLoadingSeatsForTemplate: isLoadingSeats
    };
};
