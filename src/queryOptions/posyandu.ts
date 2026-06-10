import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createPosyandu, deletePosyandu, getPosyandu, updatePosyandu } from "../api/posyandu";
import type { GetPosyanduParams, PostPosyandu } from "../types/posyandu";
import mockDataPosyandu from "../mocks/posyandu.json";

export function getPosyanduQueryOptions(params?: GetPosyanduParams) {
  return queryOptions({
    queryKey: ["posyandu", params],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockDataPosyandu;
    },

    // UNCOMMENT KLO DIRUMAH
    // queryFn: () => getPosyandu(params),
  });
}

export function createPosyanduMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input }: { input: PostPosyandu }) => createPosyandu(input),
  });
}

export function updatePosyanduMutationOptions() {
  return mutationOptions({
    mutationFn: ({ posyandu_id, input }: { posyandu_id: number; input: PostPosyandu }) => updatePosyandu(posyandu_id, input),
  });
}

export function deletePosyanduMutationOptions() {
  return mutationOptions({
    mutationFn: (posyandu_id: number) => deletePosyandu(posyandu_id),
  });
}
