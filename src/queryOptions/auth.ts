import { deleteAuthToken, getAuth, postLogin } from "@/api/auth";
import type { LoginInput } from "@/types/auth";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function postLoginMutationOptions() {
  return mutationOptions({
    mutationFn: (input: LoginInput) => postLogin(input),
  });
}

export function deleteAuthTokenMutationOptions() {
  return mutationOptions({
    mutationFn: deleteAuthToken,
  });
}

export function getAuthUserQueryOptions() {
  return queryOptions({
    queryKey: ["auth-user"],
    queryFn: getAuth,
    staleTime: 30 * 60 * 1000, // 30 menit
    gcTime: 60 * 60 * 1000, // 1 jam
  });
}
