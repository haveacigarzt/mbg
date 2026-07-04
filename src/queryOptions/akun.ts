import { createUser, deleteUser, getAkun, getUsersSummary, updateAktivasiUser } from '@/api/akun';
import type { GetAkunParams, PostAkunInput } from '@/types/akun';
import { mutationOptions, queryOptions } from '@tanstack/react-query';

export function getAkunQueryOptions(params?: GetAkunParams) {
  return queryOptions({
    queryKey: ['akun', params],
    queryFn: () => getAkun(params),
    refetchOnWindowFocus: false
  });
}

export function getUsersSummaryQueryOptions() {
  return queryOptions({
    queryKey: ['users-summary'],
    queryFn: getUsersSummary,
    refetchOnWindowFocus: false
  });
}

export function createUserMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input }: { input: PostAkunInput }) => createUser(input)
  });
}

export function updateAktivasiUserMutationOptions() {
  return mutationOptions({
    mutationFn: ({ id, value }: { id: number; value: boolean }) => updateAktivasiUser(id, value)
  });
}

export function deleteUserMutationOptions() {
  return mutationOptions({
    mutationFn: ({ id }: { id: number }) => deleteUser(id)
  });
}
