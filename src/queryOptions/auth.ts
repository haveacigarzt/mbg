import { deleteAuthToken, getAuth, postLogin } from "@/api/auth";
import type { LoginInput } from "@/types/auth";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function postLoginMutationOptions() {
  return mutationOptions({
    // --- VERSI MOCKING WFC ---
    // mutationFn: async (input: LoginInput) => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   console.log("[MOCK] Pura-pura login berhasil dengan:", input);
    //   return {
    //     token: "dummy-token-wfc-123",
    //     message: "Login sukses!",
    //   };
    // },

    // MUTATION FN KALAU SERVER HIDUP PLEASE UNCOMMENT
    mutationFn: (input: LoginInput) => postLogin(input),
  });
}

export function deleteAuthTokenMutationOptions() {
  return mutationOptions({
    // --- VERSI MOCKING WFC ---
    // mutationFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   console.log("[MOCK] Pura-pura logout berhasil");
    //   return { message: "Berhasil logout" };
    // },

    // MUTATION FN KALAU SERVER HIDUP PLEASE UNCOMMENT
    mutationFn: deleteAuthToken,
  });
}

export function getAuthUserQueryOptions() {
  return queryOptions({
    queryKey: ["auth-user"],

    // --- VERSI MOCKING WFC ---
    // queryFn: async () => {
    //   // await new Promise((resolve) => setTimeout(resolve, 300));
    //   console.log("[MOCK] Melewati gerbang Auth dengan user dummy");

    //   return {
    //     user: {
    //       id: 1,
    //       name: "Admin WFC",
    //       email: "admin@wfc.local",
    //       role: {
    //         role_id: 3,
    //         role_name: "Super Admin",
    //         id_in_role: 4,
    //       },
    //     },
    //   };
    // },

    // QUERY FN KALAU SERVER HIDUP PLEASE UNCOMMENT
    queryFn: getAuth,

    staleTime: 30 * 60 * 1000, // 30 menit
    gcTime: 60 * 60 * 1000, // 1 jam
  });
}
