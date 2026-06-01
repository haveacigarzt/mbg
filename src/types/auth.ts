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

export type AuthResponse = {
  user: {
    id: 34;
    created_at: string;
    name: string;
    email: string;
    activated: boolean;
    role_id: number;
  };
};
