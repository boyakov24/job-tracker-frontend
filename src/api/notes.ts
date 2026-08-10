import { http } from "./http";

type CreateNoteData = {
  jobId: string;
  content: string;
};

export async function getNotes(jobId: string) {
  const response = await http.get(`/jobs/${jobId}/notes`);

  return response.data;
}

export async function createNote(data: CreateNoteData) {
  const response = await http.post(`/jobs/${data.jobId}/notes`, {
    content: data.content,
  });

  return response.data;
}

export async function getNote(noteId: string) {
  const response = await http.get(`/notes/${noteId}`);

  return response.data;
}

export async function updateNote(noteId: string, content: string) {
  const response = await http.patch(`/notes/${noteId}`, {
    content,
  });

  return response.data;
}

export async function deleteNote(noteId: string) {
  await http.delete(`/notes/${noteId}`);
}
