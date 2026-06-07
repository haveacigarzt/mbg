import type { Metadata } from "./metadata";

export type CreateTrackingInput = {
  pengiriman_id: number;
  longitude: number;
  latitude: number;
  speed: number;
  accuracy: number;
};

type Tracks = {
  accuracy: number;
  created_at: string;
  id: number;
  latitude: number;
  longitude: number;
  pengiriman_id: number;
  speed: number;
};

export type Tracking = {
  accuracy: number;
  created_at: string;
  id: number;
  latitude: number;
  longitude: number;
  pengiriman_id: number;
  speed: number;
  tujuan_lat: number;
  tujuan_lng: number;
  tujuan_nama: string;
};

export type FetchTrackingResponse = {
  metadata: Metadata;
  tracking: Tracking[];
};
