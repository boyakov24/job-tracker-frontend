import { http } from "./http";
import type { Note } from "@/types/note";

export type CreateNoteData = {
  jobId: string;
  content: string;
};

export async function getNotes(jobId: string): Promise<Note[]> {
  const response = await http.get<Note[]>(`/jobs/${jobId}/notes`);

  return response.data;
}

export async function createNote(data: CreateNoteData): Promise<Note> {
  const response = await http.post<Note>(`/jobs/${data.jobId}/notes`, {
    content: data.content,
  });

  return response.data;
}

export async function getNote(noteId: string): Promise<Note> {
  const response = await http.get<Note>(`/notes/${noteId}`);

  return response.data;
}

export async function updateNote(
  noteId: string,
  content: string,
): Promise<Note> {
  const response = await http.patch<Note>(`/notes/${noteId}`, {
    content,
  });

  return response.data;
}

export async function deleteNote(noteId: string): Promise<void> {
  await http.delete(`/notes/${noteId}`);
}
