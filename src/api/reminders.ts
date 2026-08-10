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

type CreateReminderData = {
  noteId: string;
  remindAt: string;
};

export async function createReminder(data: CreateReminderData) {
  const response = await http.post(`/notes/${data.noteId}/reminders`, {
    remindAt: data.remindAt,
  });

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

export async function getReminderById(reminderId: string) {
  const response = await http.get(`/reminders/${reminderId}`);

  return response.data;
}

export async function updateReminder(reminderId: string, remindAt: string) {
  const response = await http.patch(`/reminders/${reminderId}`, {
    remindAt,
  });

  return response.data;
}

export async function deleteReminder(reminderId: string) {
  await http.delete(`/reminders/${reminderId}`);
}
