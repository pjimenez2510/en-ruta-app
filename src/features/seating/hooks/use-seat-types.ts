"use client";

import { useEffect, useState } from "react";
import {
  getAll,
  createSeatingType,
  updateSeatingType,
  deactivateSeatType,
} from "../services/seat-type.service";
import { useSession } from "next-auth/react";
import { SeatType } from "../interfaces/seat-type.interface";

export const useSeatTypes = () => {
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = (session?.user?.accessToken as string) || null;

  const fetchSeatTypes = async () => {
    try {
      setLoading(true);
      const data = await getAll(token);
      if (Array.isArray(data)) {
        setSeatTypes(data);
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
  };

  const createSeatType = async (data: Partial<SeatType>) => {
    try {
      const newSeatType = await createSeatingType(data, token);
      if (newSeatType) {
        fetchSeatTypes();
      }
      return newSeatType;
    } catch (error) {
      console.error("Error al crear el tipo de asiento:", error);
      setError("Error al crear el tipo de asiento");
      throw error;
    }
  };

  const updateSeatType = async (data: Partial<SeatType>, id: number) => {
    try {
      const updatedSeatType = await updateSeatingType(data, id, token);
      if (updatedSeatType) {
        fetchSeatTypes();
      }
      return updatedSeatType;
    } catch (error) {
      console.error("Error al actualizar el tipo de asiento:", error);
      setError("Error al actualizar el tipo de asiento");
      throw error;
    }
  };

  const removeSeatType = async (id: number) => {
    try {
      await deactivateSeatType(id, token);
      fetchSeatTypes();
    } catch (error) {
      console.error("Error al eliminar el tipo de asiento:", error);
      setError("Error al eliminar el tipo de asiento");
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      fetchSeatTypes();
    }
  }, [token]);

  return {
    seatTypes,
    loading,
    error,
    createSeatType,
    updateSeatType,
    deleteSeatType: removeSeatType,
    refreshSeatTypes: fetchSeatTypes,
  };
};
