import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReminder,
  deleteReminder,
  getReminder,
  updateReminder,
  type CreateReminderData,
} from "@/api/reminders";

export function useReminder(noteId: string) {
  return useQuery({
    queryKey: ["reminder", noteId],
    queryFn: () => getReminder(noteId),
    enabled: Boolean(noteId),
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReminderData) => createReminder(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reminder", variables.noteId],
      });
    },
  });
}

export function useUpdateReminder(noteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reminderId,
      remindAt,
    }: {
      reminderId: string;
      remindAt: string;
    }) => updateReminder(reminderId, remindAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminder", noteId] });
    },
  });
}

export function useDeleteReminder(noteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminderId: string) => deleteReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminder", noteId] });
    },
  });
}
