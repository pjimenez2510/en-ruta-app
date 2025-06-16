'use client';

import { useState, useEffect } from 'react';
import { getAll as getAllSeatTypes } from '@/features/seating/services/seat-type.service';
import { SeatType } from '@/features/seating/interfaces/seat-type.interface';
import { useSession } from 'next-auth/react';

export const useSeatTypes = () => {
    const { data: session } = useSession();
    const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
    const [selectedSeatType, setSelectedSeatType] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSeatTypes = async () => {
            try {
                const token = session?.user?.accessToken || null;
                const types = await getAllSeatTypes(token!);
                setSeatTypes(types);
                if (types.length > 0) {
                    setSelectedSeatType(types[0].id);
                }
                setError(null);
            } catch (error) {
                console.error('Error loading seat types:', error);
                setError('Error al cargar los tipos de asiento');
            } finally {
                setLoading(false);
            }
        };

        loadSeatTypes();
    }, [session?.user?.accessToken]);

    return {
        seatTypes,
        selectedSeatType,
        setSelectedSeatType,
        loading,
        error
    };
}; 