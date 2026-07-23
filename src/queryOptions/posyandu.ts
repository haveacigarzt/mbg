import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { createPosyandu, deletePosyandu, getBalita, getBumil, getBusui, getIbu, getPosyandu, postBalita, postBumil, postBusui, updatePosyandu } from '../api/posyandu';
import type { BalitaInput, BumilInput, BusuiInput, Get3BParams, GetPosyanduParams, PostPosyandu } from '../types/posyandu';
import mockDataPosyandu from '../mocks/posyandu.json';

export function getPosyanduQueryOptions(params?: GetPosyanduParams) {
  return queryOptions({
    queryKey: ['posyandu', params],
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 800));
    //   return mockDataPosyandu;
    // },

    // UNCOMMENT KLO DIRUMAH
    queryFn: () => getPosyandu(params)
  });
}

export function createPosyanduMutationOptions() {
  return mutationOptions({
    mutationFn: ({ input }: { input: PostPosyandu }) => createPosyandu(input)
  });
}

export function updatePosyanduMutationOptions() {
  return mutationOptions({
    mutationFn: ({ posyandu_id, input }: { posyandu_id: number; input: PostPosyandu }) => updatePosyandu(posyandu_id, input)
  });
}

export function deletePosyanduMutationOptions() {
  return mutationOptions({
    mutationFn: (posyandu_id: number) => deletePosyandu(posyandu_id)
  });
}

export function getBalitaQueryOptions(id: number, params?: Get3BParams) {
  return queryOptions({
    queryKey: ['balita', params],
    queryFn: () => getBalita(id, params)
  });
}

export function getBumilQueryOptions(id: number, params?: Get3BParams) {
  return queryOptions({
    queryKey: ['bumil', params],
    queryFn: () => getBumil(id, params)
  });
}

export function getBusuiQueryOptions(id: number, params?: Get3BParams) {
  return queryOptions({
    queryKey: ['busui', params],
    queryFn: () => getBusui(id, params)
  });
}

export function getIbuQueryOptions(id: number, params?: Get3BParams) {
  return queryOptions({
    queryKey: ['ibu', params],
    queryFn: () => getIbu(id, params)
  });
}

export function createBalitaMutationOptions() {
  return mutationOptions({
    mutationFn: ({ posyandu_id, input }: { posyandu_id: number; input: BalitaInput }) => postBalita(posyandu_id, input)
  });
}

export function createBumilMutationOptions() {
  return mutationOptions({
    mutationFn: ({ posyandu_id, input }: { posyandu_id: number; input: BumilInput }) => postBumil(posyandu_id, input)
  });
}

export function createBusuiMutationOptions() {
  return mutationOptions({
    mutationFn: ({ posyandu_id, input }: { posyandu_id: number; input: BusuiInput }) => postBusui(posyandu_id, input)
  });
}
