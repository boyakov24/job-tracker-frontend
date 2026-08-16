import { http } from "./http";
import type { UserProfile } from "./auth";

export type UpdateProfileData = {
  email: string;
};

export async function updateProfile(
  data: UpdateProfileData,
): Promise<UserProfile> {
  const response = await http.patch<UserProfile>("/users/profile", data);

  return response.data;
}

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export async function changePassword(data: ChangePasswordData) {
  const response = await http.patch("/users/password", data);

  return response.data;
}

export async function deleteAccount(): Promise<void> {
  await http.delete("/users");
}
