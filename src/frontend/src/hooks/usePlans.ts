import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PlanEntry, PlanMetadata, StructuredPlan, ExternalBlob } from '../backend';

export function useGetPlans(limit: number = 100) {
  const { actor, isFetching } = useActor();

  return useQuery<PlanEntry[]>({
    queryKey: ['plans', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlans(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPlanById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PlanEntry | null>({
    queryKey: ['plan', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlanById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreatePlan() {
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
      if (!actor) throw new Error('Actor not available');
      await actor.createPlan(id, metadata, poster, structuredContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
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
      if (!actor) throw new Error('Actor not available');
      await actor.updatePlan(id, metadata, poster, structuredContent);
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
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
