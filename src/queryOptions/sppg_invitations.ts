import { createSPPGByInvitation } from '@/api/sppg';
import { createSPPGInvitations, getSPPGInvitation, getSPPGInvitations } from '@/api/sppg_invitations';
import type { CreateSPPGByInvitationRequest, CreateSPPGInvitationsInput, GetSPPGInvitationParams } from '@/types/sppg_invitations';
import { mutationOptions, queryOptions } from '@tanstack/react-query';

export function createSPPGInvitationsMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input }: { input: CreateSPPGInvitationsInput }) => createSPPGInvitations(input)
  });
}

export function getSPPGInvitationsQueryOptions(params?: GetSPPGInvitationParams) {
  return queryOptions({
    queryKey: ['invitations', params],
    queryFn: () => getSPPGInvitations(params),
    refetchOnWindowFocus: false
  });
}

export function getSPPGInvitationQueryOptions(token: string) {
  return queryOptions({
    queryKey: ['invitation', token],
    queryFn: () => getSPPGInvitation(token),
    refetchOnWindowFocus: false
  });
}

export function createSPPGByInvitationMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input, token }: { input: CreateSPPGByInvitationRequest; token: string }) => createSPPGByInvitation(input, token)
  });
}
