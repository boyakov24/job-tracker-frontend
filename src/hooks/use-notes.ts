import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
  type CreateNoteData,
} from "@/api/notes";

export function useNotes(jobId: string) {
  return useQuery({
    queryKey: ["notes", jobId],
    queryFn: () => getNotes(jobId),
    enabled: Boolean(jobId),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteData) => createNote(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes", variables.jobId] });
    },
  });
}

export function useUpdateNote(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, content }: { noteId: string; content: string }) =>
      updateNote(noteId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", jobId] });
    },
  });
}

export function useDeleteNote(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", jobId] });
    },
  });
}
