import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TripsService } from '../services/trips.service';
import { Trip, CreateTripDTO, TripFilters } from '../interfaces/trips.interface';

export const useTrips = () => {
  const [filters, setFilters] = useState<TripFilters>({});
  const queryClient = useQueryClient();

  // Query para obtener trips filtrados
  const {
    data: trips = [],
    isLoading,
    isFetching,
    error
  } = useQuery<Trip[]>({
    queryKey: ['trips', filters], // CRÍTICO: los filtros en el queryKey
    queryFn: () => {
      console.log('=== EXECUTING QUERY ===');
      console.log('Filtros enviados a service:', filters);
      return TripsService.getAll(filters);
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
    // cacheTime: 5 * 60 * 1000, // Puedes agregar esto si tu versión lo soporta
  });

  // Query para obtener todos los trips (sin filtros) para las opciones de filtros
  const { data: allTrips = [] } = useQuery<Trip[]>({
    queryKey: ['trips', 'all'],
    queryFn: () => TripsService.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutations
  const createTrip = useMutation({
    mutationFn: (data: CreateTripDTO) => TripsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const updateTrip = useMutation({
    mutationFn: ({ id, trip }: { id: number; trip: CreateTripDTO }) =>
      TripsService.update(id, trip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const deleteTrip = useMutation({
    mutationFn: (id: number) => TripsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  // Debug logging
  console.log('=== USE TRIPS HOOK DEBUG ===');
  console.log('Current filters:', filters);
  console.log('Trips count:', trips.length);
  console.log('AllTrips count:', allTrips.length);
  console.log('Is loading:', isLoading);
  console.log('Is fetching:', isFetching);
  console.log('===========================');

  return {
    trips,
    allTrips,
    isLoading,
    isFetching,
    error,
    filters,
    setFilters,
    createTrip,
    updateTrip,
    deleteTrip,
  };
};