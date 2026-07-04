import type { Metadata } from './metadata';

export type CreateSPPGInvitationsInput = {
  nama_sppg: string;
};

export interface CreateSPPGByInvitationRequest {
  nama: string;
  alamat: string;
  kepala_sppg: string;
  nomor_telepon: string;
  email: string;
  kelurahan_id: number;
  kecamatan_id: number;
  kapasitas_porsi: number;
  latitude: number;
  longitude: number;
  sosmed_url: string[];

  email_user: string;
  password: string;
}

export interface NullTime {
  Time: string;
  Valid: boolean;
}

export interface SPPGInvitation {
  id: number;
  created_at: string;
  token: string;
  expires_at: NullTime;
  used_at: NullTime;
  nama_sppg: string;
}

export interface CreateSPPGInvitationResponse {
  invitation: SPPGInvitation;
}

export type GetSPPGInvitationParams = {
  page?: number;
  page_size?: number;
  sort?: string;
};

export type FetchSPPGInvitationsResponse = {
  invitations: SPPGInvitation[];
  metadata: Metadata;
};
