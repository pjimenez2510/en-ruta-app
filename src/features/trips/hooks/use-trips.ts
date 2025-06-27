import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trip, TripFilters, CreateTripDTO } from '../interfaces/trips.interface';
import { TripsService } from '../services/trips.service';
import { useState } from 'react';

export const useTrips = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TripFilters>({});  const { data: trips = [], isLoading, isFetching } = useQuery<Trip[]>({
    queryKey: ['trips', filters],
    queryFn: () => TripsService.getAll(filters),
    staleTime: 1000 * 60 * 5, // Considera los datos frescos por 5 minutos
    refetchInterval: 1000 * 30, // Refresca cada 30 segundos
  });
  const createTrip = useMutation({
    mutationFn: (newTrip: CreateTripDTO) => TripsService.create(newTrip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }
  });

  const updateTrip = useMutation({
    mutationFn: ({ id, trip }: { id: number; trip: CreateTripDTO }) =>
      TripsService.update(id, trip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }
  });

  const deleteTrip = useMutation({
    mutationFn: (id: number) => TripsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }
  });

  return {
    trips,
    isLoading,
    isFetching,
    filters,
    setFilters,
    createTrip,
    updateTrip,
    deleteTrip
  };
};
