import { useEffect, useState } from "react";
import axios from "axios";
import {
  useReminder,
  useCreateReminder,
  useUpdateReminder,
  useDeleteReminder,
} from "@/hooks/use-reminders";
import ValidatedInput from "../ui/validated-input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ReminderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string;
};

export function ReminderDialog({
  open,
  onOpenChange,
  noteId,
}: ReminderDialogProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  const { data: reminder } = useReminder(noteId);

  const createReminderMutation = useCreateReminder();
  const updateReminderMutation = useUpdateReminder(noteId);
  const deleteReminderMutation = useDeleteReminder(noteId);

  const isPending =
    createReminderMutation.isPending ||
    updateReminderMutation.isPending ||
    deleteReminderMutation.isPending;

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    setDateError("");
    setTimeError("");

    if (reminder) {
      const reminderDate = new Date(reminder.remindAt);

      setDate(reminderDate.toLocaleDateString("en-CA"));

      setTime(
        reminderDate.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } else {
      setDate("");
      setTime("");
    }
  }, [open, reminder]);

  const handleDelete = () => {
    if (!reminder) return;

    deleteReminderMutation.mutate(reminder.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.error("Failed to delete reminder:", error.response?.data);
        } else {
          console.error("Unknown error:", error);
        }
      },
    });
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasError = false;

    if (!date.trim()) {
      setDateError("This field is required");
      hasError = true;
    } else {
      setDateError("");
    }

    if (!time.trim()) {
      setTimeError("This field is required");
      hasError = true;
    } else {
      setTimeError("");
    }

    if (hasError) return;

    const remindAt = new Date(`${date}T${time}`).toISOString();

    if (reminder) {
      updateReminderMutation.mutate(
        { reminderId: reminder.id, remindAt },
        {
          onSuccess: () => onOpenChange(false),
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              console.error(
                "Backend validation:",
                error.response?.data?.message,
              );
            }
          },
        },
      );
    } else {
      createReminderMutation.mutate(
        { noteId, remindAt },
        {
          onSuccess: () => onOpenChange(false),
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              console.error(
                "Backend validation:",
                error.response?.data?.message,
              );
            }
          },
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[350px] rounded-2xl border border-app-slate-200 bg-app-white p-6 shadow-xl shadow-slate-200/50"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-app-slate-900">
            {reminder ? "Edit reminder" : "Set reminder"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reminder-date" className="text-sm font-medium">
              Date
            </label>

            <ValidatedInput
              id="reminder-date"
              type="date"
              value={date}
              min={today}
              onChange={(event) => {
                setDate(event.target.value);
                setDateError("");
              }}
              error={dateError}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reminder-time" className="text-sm font-medium">
              Time
            </label>

            <ValidatedInput
              id="reminder-time"
              type="time"
              value={time}
              onChange={(event) => {
                setTime(event.target.value);
                setTimeError("");
              }}
              error={timeError}
            />
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-app-sky-500 py-3 font-semibold text-app-white transition-colors duration-200 hover:bg-app-sky-600 focus:outline-none focus:ring-2 focus:ring-app-sky-500 focus:ring-offset-2 dissabled:opacity-50"
            >
              {reminder ? "Update" : "Set"}
            </button>

            {reminder && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 rounded-lg border border-app-rose-200 py-3 font-semibold text-app-rose-600 transition-colors duration-200 hover:bg-app-rose-50 dissabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ReminderDialog;
