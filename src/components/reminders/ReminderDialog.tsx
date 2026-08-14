import { useEffect, useState } from "react";
import axios from "axios";

import {
  createReminder,
  updateReminder,
  deleteReminder,
  type Reminder,
} from "@/api/reminders";

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
  reminder: Reminder | null;
  onCreated: () => void;
};

function ReminderDialog({
  open,
  onOpenChange,
  noteId,
  reminder,
  onCreated,
}: ReminderDialogProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

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

  const handleDelete = async () => {
    if (!reminder) {
      return;
    }

    try {
      await deleteReminder(reminder.id);

      onOpenChange(false);
      onCreated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to delete reminder:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const remindAt = new Date(`${date}T${time}`).toISOString();

      if (reminder) {
        await updateReminder(reminder.id, remindAt);
      } else {
        await createReminder({
          noteId,
          remindAt,
        });
      }

      onOpenChange(false);
      onCreated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Backend validation:", error.response?.data?.message);
      } else {
        console.error("Unknown error:", error);
      }
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

            <input
              id="reminder-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-app-slate-900 outline-none transition-all focus:border-app-indigo-500 focus:ring-2 focus:ring-app-indigo-500/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reminder-time" className="text-sm font-medium">
              Time
            </label>

            <input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-app-slate-900 outline-none transition-all focus:border-app-indigo-500 focus:ring-2 focus:ring-app-indigo-500/20"
            />
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-app-sky-500 py-3 font-semibold text-app-white transition-colors duration-200 hover:bg-app-sky-600 focus:outline-none focus:ring-2 focus:ring-app-sky-500 focus:ring-offset-2"
            >
              {reminder ? "Update" : "Set"}
            </button>

            {reminder && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg border border-app-rose-200 py-3 font-semibold text-app-rose-600 transition-colors duration-200 hover:bg-app-rose-50"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ReminderDialog;
