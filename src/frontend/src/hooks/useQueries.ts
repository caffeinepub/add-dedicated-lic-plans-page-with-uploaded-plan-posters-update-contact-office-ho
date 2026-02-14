import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ProductInterest } from '../backend';

interface EnquiryInput {
  name: string;
  phone: string | null;
  email: string;
  city: string | null;
  productInterest: string | null;
  message: string;
}

export function useSubmitEnquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EnquiryInput) => {
      if (!actor) throw new Error('Actor not available');

      // Map product interest string to enum
      let productInterestEnum: ProductInterest | null = null;
      if (input.productInterest) {
        const mapping: Record<string, ProductInterest> = {
          'term': ProductInterest.other,
          'endowment': ProductInterest.other,
          'ulip': ProductInterest.other,
          'pension': ProductInterest.other,
          'child': ProductInterest.other,
          'other': ProductInterest.other
        };
        productInterestEnum = mapping[input.productInterest] || ProductInterest.other;
      }

      await actor.submitEnquiry(
        input.name,
        input.phone,
        input.email,
        input.city,
        productInterestEnum,
        input.message
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    }
  });
}
