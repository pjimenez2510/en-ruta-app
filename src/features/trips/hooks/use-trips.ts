import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trip, TripFilters } from '../interfaces/trips.interface';
import { TripsService } from '../services/trips.service';
import { useState } from 'react';

export const useTrips = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TripFilters>({});

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips', filters],
    queryFn: () => TripsService.getAll()
  });

  const createTrip = useMutation({
    mutationFn: (newTrip: Partial<Trip>) => TripsService.create(newTrip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }
  });

  const updateTrip = useMutation({
    mutationFn: ({ id, trip }: { id: number; trip: Partial<Trip> }) =>
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

  const filteredTrips = trips.filter((trip) => {
    if (filters.fecha && new Date(trip.fecha).toDateString() !== filters.fecha.toDateString()) {
      return false;
    }
    if (filters.estado && trip.estado !== filters.estado) {
      return false;
    }
    if (filters.rutaId && trip.horarioRuta.ruta.id !== filters.rutaId) {
      return false;
    }
    if (filters.busId && trip.bus.id !== filters.busId) {
      return false;
    }
    return true;
  });

  return {
    trips: filteredTrips,
    isLoading,
    filters,
    setFilters,
    createTrip,
    updateTrip,
    deleteTrip
  };
};
