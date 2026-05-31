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
