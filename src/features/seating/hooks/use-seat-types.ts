"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAll,
  createSeatingType,
  updateSeatingType,
  deactivateSeatType,
} from "../services/seat-type.service";
import { useSession } from "next-auth/react";
import { SeatType } from "../interfaces/seat-type.interface";

// Cache global para tipos de asientos
let seatTypesCache: SeatType[] = [];
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para eliminar duplicados basados en el ID
const removeDuplicates = (seatTypes: SeatType[]): SeatType[] => {
  const seen = new Set();
  return seatTypes.filter(type => {
    if (seen.has(type.id)) {
      return false;
    }
    seen.add(type.id);
    return true;
  });
};

export const useSeatTypes = () => {
  const [seatTypes, setSeatTypes] = useState<SeatType[]>(removeDuplicates(seatTypesCache));
  const [loading, setLoading] = useState(!seatTypesCache.length);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeatType, setSelectedSeatType] = useState<number | null>(null);
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  const fetchSeatTypes = useCallback(async (force = false) => {
    // Si hay datos en caché y no ha pasado el tiempo de expiración, usar caché
    if (!force && seatTypesCache.length > 0 && Date.now() - lastFetch < CACHE_DURATION) {
      setSeatTypes(removeDuplicates(seatTypesCache));
      setLoading(false);
      return;
    }

    if (!token) return;

    try {
      setLoading(true);
      const data = await getAll(token);
      if (Array.isArray(data)) {
        const uniqueData = removeDuplicates(data);
        seatTypesCache = uniqueData;
        lastFetch = Date.now();
        setSeatTypes(uniqueData);
      } else {
        console.error("Los datos recibidos no son un array:", data);
        setSeatTypes([]);
      }
      setError(null);
    } catch (error) {
      console.error("Error al cargar los tipos de asientos:", error);
      setError("Error al cargar los tipos de asientos");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createSeatType = useCallback(async (data: Partial<SeatType>) => {
    if (!token) throw new Error("No hay una sesión activa");

    try {
      const newSeatType = await createSeatingType(data, token);
      if (newSeatType) {
        seatTypesCache = removeDuplicates([...seatTypesCache, newSeatType]);
        setSeatTypes(seatTypesCache);
      }
      return newSeatType;
    } catch (error) {
      console.error("Error al crear el tipo de asiento:", error);
      setError("Error al crear el tipo de asiento");
      throw error;
    }
  }, [token]);

  const updateSeatType = useCallback(async (data: Partial<SeatType>, id: number) => {
    if (!token) throw new Error("No hay una sesión activa");

    try {
      const updatedSeatType = await updateSeatingType(data, id, token);
      if (updatedSeatType) {
        seatTypesCache = removeDuplicates(
          seatTypesCache.map(type => type.id === id ? updatedSeatType : type)
        );
        setSeatTypes(seatTypesCache);
      }
      return updatedSeatType;
    } catch (error) {
      console.error("Error al actualizar el tipo de asiento:", error);
      setError("Error al actualizar el tipo de asiento");
      throw error;
    }
  }, [token]);

  const removeSeatType = useCallback(async (id: number) => {
    if (!token) throw new Error("No hay una sesión activa");

    try {
      await deactivateSeatType(id, token);
      seatTypesCache = seatTypesCache.filter(type => type.id !== id);
      setSeatTypes(seatTypesCache);
    } catch (error) {
      console.error("Error al eliminar el tipo de asiento:", error);
      setError("Error al eliminar el tipo de asiento");
      throw error;
    }
  }, [token]);

  useEffect(() => {
    fetchSeatTypes();
  }, [fetchSeatTypes]);

  // Limpiar el caché cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (Date.now() - lastFetch > CACHE_DURATION) {
        seatTypesCache = [];
        lastFetch = 0;
      }
    };
  }, []);

  // Limpiar cache cuando cambia el token (usuario)
  useEffect(() => {
    seatTypesCache = [];
    lastFetch = 0;
    setSeatTypes([]);
    setLoading(true);
    fetchSeatTypes(true); // Forzar recarga
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return {
    seatTypes,
    loading,
    error,
    selectedSeatType,
    setSelectedSeatType,
    createSeatType,
    updateSeatType,
    deleteSeatType: removeSeatType,
    refreshSeatTypes: () => fetchSeatTypes(true),
  };
};
