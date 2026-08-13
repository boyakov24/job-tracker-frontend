import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/auth-provider";
import { updateProfile, changePassword, deleteAccount } from "@/api/users";

type AccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const { user, updateUser, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user, open]);

  const resetDialogState = () => {
    setEmail(user?.email ?? "");

    setIsEditingEmail(false);
    setIsUpdatingEmail(false);

    setCurrentPassword("");
    setNewPassword("");
    setIsEditingPassword(false);
    setIsChangingPassword(false);

    setShowCurrentPassword(false);
    setShowNewPassword(false);
  };

  const handleUpdateEmail = async () => {
    if (!email.trim() || isUpdatingEmail) {
      return;
    }

    try {
      setIsUpdatingEmail(true);

      const updatedUser = await updateProfile({
        email: email.trim(),
      });

      updateUser(updatedUser);

      setIsEditingEmail(false);
    } catch (error) {
      console.error("Failed to update email:", error);
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      return;
    }

    if (isChangingPassword) {
      return;
    }

    try {
      setIsChangingPassword(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setIsEditingPassword(false);
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (isDeletingAccount) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingAccount(true);

      await deleteAccount();

      logout();
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleCancel = () => {
    setEmail(user?.email ?? "");
    setIsEditingEmail(false);
  };

  const handleCancelPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setIsEditingPassword(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetDialogState();
        }

        onOpenChange(open);
      }}
    >
      <DialogContent
        className="sm:max-w-[400px] rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xl shadow-slate-200/50"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-[#0f172a]">
            Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <p className="text-lg font-medium">Email</p>

          {!isEditingEmail ? (
            <div className="flex h-[42px] items-center gap-2">
              <p className="text-lg text-slate-500">
                {user?.email ?? "Loading..."}
              </p>

              {user?.email && (
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-indigo-500/10"
                  aria-label="Edit email"
                >
                  <span className="text-sm">✏️</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex w-full items-center gap-2">
              <input
                id="account-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isUpdatingEmail}
                className="flex-1 rounded-lg border border-slate-200 px-3.5 py-2.5 text-base text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
              />

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleUpdateEmail}
                  disabled={isUpdatingEmail || !email}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#34d399] transition-colors duration-200 hover:bg-[#34d399]/10 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Save email"
                >
                  <span className="text-md font-bold">✓</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isUpdatingEmail}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-rose-600 transition-colors duration-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Cancel"
                >
                  <span className="text-md font-bold">✕</span>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 space-y-1">
          <p className="text-lg font-medium">Password</p>

          {!isEditingPassword ? (
            <div className="flex items-center gap-2 h-[42px]">
              <p className="text-lg text-slate-500">••••••••</p>

              <button
                type="button"
                onClick={() => setIsEditingPassword(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-indigo-500/10 transition-colors duration-200"
                aria-label="Change password"
              >
                <span className="text-sm">✏️</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Current password"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-11 text-base text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showCurrentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="New password"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-11 text-base text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={
                    isChangingPassword ||
                    !currentPassword.trim() ||
                    !newPassword.trim()
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#34d399] hover:bg-[#34d399]/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Save password"
                >
                  <span className="text-md font-bold">✓</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelPassword}
                  disabled={isChangingPassword}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-rose-600 hover:bg-rose-50 transition-colors duration-200 disabled:opacity-50"
                  aria-label="Cancel"
                >
                  <span className="text-md font-bold">✕</span>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 border-t border-slate-200 pt-5">
          <p className="mt-1 text-sm text-slate-500">
            Permanently delete your account and all associated data.
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount}
            className="mt-4 rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-colors duration-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeletingAccount ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AccountDialog;
