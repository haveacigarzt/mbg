import type { CreateSPPGInvitationResponse, CreateSPPGInvitationsInput, FetchSPPGInvitationsResponse, GetSPPGInvitationParams, SPPGInvitation } from '@/types/sppg_invitations';
import { ApiError, apiFetch } from './client';
import type { FetchAkunResponse } from '@/types/akun';

export async function createSPPGInvitations(input: CreateSPPGInvitationsInput) {
  const response = await apiFetch(`/v1/admin/invitation/new`, {
    method: 'POST',
    body: JSON.stringify(input)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Create invitation gagal', response.status, data);
  }

  return data as CreateSPPGInvitationResponse;
  // console.log(data);
}

export async function getSPPGInvitations(params?: GetSPPGInvitationParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const response = await apiFetch(`/v1/admin/invitation?${searchParams.toString()}`);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Get all invitation gagal', response.status, data);
  }
  return data as FetchSPPGInvitationsResponse;
}

export async function getSPPGInvitation(token: string) {
  const response = await apiFetch(`/v1/invitation/${token}`);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || 'Get invitation gagal', response.status, data);
  }
  return data.invitation as SPPGInvitation;
}
