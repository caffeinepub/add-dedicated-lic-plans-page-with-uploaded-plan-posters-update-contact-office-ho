import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PlanEntry, PlanMetadata, StructuredPlan, ExternalBlob } from '../backend';

export function useGetPlans(limit: number = 100) {
  const { actor, isFetching } = useActor();

  return useQuery<PlanEntry[]>({
    queryKey: ['plans', limit],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available. Please check your connection.');
      try {
        return await actor.getPlans(BigInt(limit));
      } catch (error: any) {
        console.error('Failed to fetch plans:', error);
        throw new Error(`Failed to load plans: ${error.message || 'Unknown error'}`);
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

export function useGetPlanById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PlanEntry | null>({
    queryKey: ['plan', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getPlanById(id);
      } catch (error: any) {
        console.error('Failed to fetch plan:', error);
        throw new Error(`Failed to load plan: ${error.message || 'Unknown error'}`);
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateOrUpdatePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      metadata,
      poster,
      structuredContent,
    }: {
      id: string;
      metadata: PlanMetadata;
      poster: ExternalBlob;
      structuredContent: StructuredPlan;
    }) => {
      if (!actor) {
        throw new Error('Actor not available. Please log in and try again.');
      }
      
      try {
        await actor.createOrUpdatePlan(id, metadata, poster, structuredContent);
      } catch (error: any) {
        console.error('Create/update plan failed:', error);
        
        // Map common backend errors to user-friendly messages
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Permission denied. Only authorized users can create plans.');
        }
        if (error.message?.includes('trap')) {
          throw new Error('Backend operation failed. Please check your permissions and try again.');
        }
        
        throw new Error(`Failed to save plan: ${error.message || 'Unknown error'}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error: any) => {
      console.error('Plan mutation error:', error);
    },
  });
}

export function useUpdatePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      metadata,
      poster,
      structuredContent,
    }: {
      id: string;
      metadata: PlanMetadata;
      poster: ExternalBlob;
      structuredContent: StructuredPlan;
    }) => {
      if (!actor) {
        throw new Error('Actor not available. Please log in and try again.');
      }
      
      try {
        await actor.updatePlan(id, metadata, poster, structuredContent);
      } catch (error: any) {
        console.error('Update plan failed:', error);
        
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Permission denied. Only the plan creator or admins can update this plan.');
        }
        if (error.message?.includes('not found')) {
          throw new Error('Plan not found. It may have been deleted.');
        }
        
        throw new Error(`Failed to update plan: ${error.message || 'Unknown error'}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plan', variables.id] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Failed to check admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
