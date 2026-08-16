import { http } from "./http";
import axios from "axios";

export type Reminder = {
  id: string;
  noteId: string;
  remindAt: string;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateReminderData = {
  noteId: string;
  remindAt: string;
};

export async function createReminder(
  data: CreateReminderData,
): Promise<Reminder> {
  const response = await http.post<Reminder>(
    `/notes/${data.noteId}/reminders`,
    {
      remindAt: data.remindAt,
    },
  );

  return response.data;
}

export async function getReminder(noteId: string): Promise<Reminder | null> {
  try {
    const response = await http.get<Reminder>(`/notes/${noteId}/reminders`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getReminderById(reminderId: string): Promise<Reminder> {
  const response = await http.get<Reminder>(`/reminders/${reminderId}`);

  return response.data;
}

export async function updateReminder(
  reminderId: string,
  remindAt: string,
): Promise<Reminder> {
  const response = await http.patch<Reminder>(`/reminders/${reminderId}`, {
    remindAt,
  });

  return response.data;
}

export async function deleteReminder(reminderId: string): Promise<void> {
  await http.delete(`/reminders/${reminderId}`);
}
