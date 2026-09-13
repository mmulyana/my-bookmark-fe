import { apiClient } from "./client";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  register: (email: string, password: string) =>
    apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};
