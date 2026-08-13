import { http } from "./http";

type RegisterDto = {
  email: string;
  password: string;
};

type LoginDto = {
  email: string;
  password: string;
};

type AuthResponse = {
  accessToken: string;
};

export type UserProfile = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export async function register(data: RegisterDto): Promise<AuthResponse> {
  const response = await http.post<AuthResponse>("/auth/register", data);

  return response.data;
}

export async function login(data: LoginDto): Promise<AuthResponse> {
  const response = await http.post<AuthResponse>("/auth/login", data);

  return response.data;
}

export async function getProfile(): Promise<UserProfile> {
  const response = await http.get<UserProfile>("/auth/profile");

  return response.data;
}
