import type { AuthResponse, LoginInput, LoginResponse } from "@/types/auth";
import { ApiError, apiFetch } from "./client";
import { redirect } from "@tanstack/react-router";
import { queryClient } from "@/main";

export async function postLogin(input: LoginInput) {
  const response = await apiFetch("/v1/tokens/authentication", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Login gagal",
      response.status,
      data,
    );
  }

  const token = data.authentication_token.token;
  const expiry = data.authentication_token.expiry;

  localStorage.setItem("token", token);
  localStorage.setItem("token_expiry", expiry);

  return data as LoginResponse;
}

export async function deleteAuthToken() {
  // const response = await apiFetch("/v1/tokens/authentication", {
  //   method: "DELETE",
  // });

  // const data = await response.json().catch(() => null);

  // if (!response.ok) {
  //   throw new ApiError(
  //     data?.message || data?.error || "Delete token gagal",
  //     response.status,
  //     data,
  //   );
  // }

  const data = {
    message: "authentication token successfully deleted",
  };

  localStorage.removeItem("token");
  localStorage.removeItem("token_expiry");

  queryClient.removeQueries({
    queryKey: ["auth-user"],
  });

  return data as { message: string };
}

export async function getAuth() {
  console.log("fetching get auth");
  const res = await apiFetch("/v1/users/authme", {
    credentials: "include",
  });
  if (!res.ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    throw redirect({
      to: "/login",
      search: {
        reason: "login_required",
      },
    });
  }
  const data = await res.json().catch(() => null);
  return data as AuthResponse;
}

export async function getMeOrNull() {
  const res = await apiFetch("/v1/users/authme", {
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}
