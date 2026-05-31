import type { LoginInput, LoginResponse } from "@/types/auth";
import { apiFetch } from "./client";

export async function postLogin(input: LoginInput) {
  const response = await apiFetch("/v1/tokens/authentication", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("gagal post login");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Login gagal");
  }

  return data as LoginResponse;
}
