import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { LICPlan } from '../backend';

export function useGetAllLICPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<LICPlan[]>({
    queryKey: ['licPlans'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAllLICPlans();
      } catch (error: any) {
        console.error('Failed to fetch LIC plans:', error);
        throw new Error(`Failed to load LIC plans: ${error.message || 'Unknown error'}`);
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

export function useGetLICPlanById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<LICPlan | null>({
    queryKey: ['licPlan', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getLICPlanById(id);
      } catch (error: any) {
        console.error('Failed to fetch LIC plan:', error);
        throw new Error(`Failed to load LIC plan: ${error.message || 'Unknown error'}`);
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
