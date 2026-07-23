export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  authentication_token: {
    token: string;
    expiry: string;
  };
};

export type RoleId = 1 | 2 | 3 | 4 | 5 | 6;

export interface AuthResponse {
  user: {
    id: number;
    created_at: string;
    name: string;
    email: string;
    activated: boolean;
    role: {
      role_id: RoleId;
      id_in_role: number;
    };
  };
}
