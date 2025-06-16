import { useQuery } from '@tanstack/react-query';
import { CrewService } from '../services/crew.service';
import { RouteSchedule, Bus, CrewMember } from '../interfaces/crew.interface';

export const useCrewData = () => {
  const { 
    data: schedules = [], 
    isLoading: isLoadingSchedules,
    error: schedulesError,
    refetch: refetchSchedules
  } = useQuery<RouteSchedule[]>({
    queryKey: ['schedules'],
    queryFn: CrewService.getSchedules,
    retry: 3,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnMount: true
  });

  const isLoading = isLoadingSchedules;
  const errors = schedulesError ? [schedulesError] : [];

  return {
    schedules: schedules as RouteSchedule[],
    buses: [] as Bus[],
    drivers: [] as CrewMember[],
    helpers: [] as CrewMember[],
    isLoading,
    hasErrors: errors.length > 0,
    errors,
    refetchSchedules
  };
};
