import { postLogin } from "@/api/auth";
import type { LoginInput } from "@/types/auth";
import { mutationOptions } from "@tanstack/react-query";

export function postLoginMutationOptions() {
  return mutationOptions({
    mutationFn: (input: LoginInput) => postLogin(input),
  });
}
