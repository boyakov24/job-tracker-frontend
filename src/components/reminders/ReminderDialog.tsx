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
      <DialogContent className="sm:max-w-[350px] rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xl shadow-slate-200/50">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-[#0f172a]">
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
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#0ea5e9] py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#0284c7] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:ring-offset-2"
            >
              {reminder ? "Update" : "Set"}
            </button>

            {reminder && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg border border-rose-200 py-3 font-semibold text-rose-600 transition-colors duration-200 hover:bg-rose-50"
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
