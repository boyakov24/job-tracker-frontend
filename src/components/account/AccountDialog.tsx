import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/auth-provider";
import { updateProfile, changePassword, deleteAccount } from "@/api/users";
import ValidatedInput from "../ui/validated-input";

type AccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const { user, updateUser, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const resetDialogState = () => {
    setEmail("");

    setIsEditingEmail(false);
    setIsUpdatingEmail(false);

    setCurrentPassword("");
    setNewPassword("");
    setIsEditingPassword(false);
    setIsChangingPassword(false);

    setShowCurrentPassword(false);
    setShowNewPassword(false);

    setEmailError("");
    setCurrentPasswordError("");
    setNewPasswordError("");
  };

  const handleUpdateEmail = async () => {
    if (isUpdatingEmail) {
      return;
    }

    let hasError = false;

    if (!email.trim()) {
      setEmailError("This field is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email is invalid");
      hasError = true;
    } else if (
      email.trim().toLowerCase() === user?.email.trim().toLowerCase()
    ) {
      setEmailError("Required a new email");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (hasError) {
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

      setEmailError("Failed to update email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (isChangingPassword) {
      return;
    }

    let hasError = false;

    if (!currentPassword.trim()) {
      setCurrentPasswordError("This field is required");
      hasError = true;
    } else if (currentPassword.length < 6) {
      setCurrentPassword("Password must be at least 6 characters");
      hasError = true;
    } else {
      setCurrentPasswordError("");
    }

    if (!newPassword.trim()) {
      setNewPasswordError("This field is required");
      hasError = true;
    } else if (newPassword.length < 6) {
      setCurrentPasswordError("Password must be at least 6 characters");
      hasError = true;
    } else if (newPassword.trim() === currentPassword.trim()) {
      setNewPasswordError("Required a new password");
      hasError = true;
    } else {
      setNewPasswordError("");
    }

    if (hasError) {
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
      setCurrentPasswordError("");
      setNewPasswordError("");
      setIsEditingPassword(false);
    } catch (error) {
      console.error("Failed to change password:", error);

      setCurrentPasswordError("Current password is incorrect");
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
    setEmail("");
    setIsEditingEmail(false);
    setEmailError("");
  };

  const handleCancelPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setIsEditingPassword(false);
    setCurrentPasswordError("");
    setNewPasswordError("");
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
        className="sm:max-w-[400px] rounded-2xl border border-app-slate-200 bg-app-white p-6 shadow-xl shadow-slate-200/50"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-app-slate-900">
            Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <p className="text-lg font-medium">Email</p>

          {!isEditingEmail ? (
            <div className="flex h-[42px] items-center gap-2">
              <p className="text-lg text-app-slate-500">
                {user?.email ?? "Loading..."}
              </p>

              {user?.email && (
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-app-hover-indigo"
                  aria-label="Edit email"
                >
                  <span className="text-sm">✏️</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex w-full items-center gap-2">
              <ValidatedInput
                id="account-email"
                type="email"
                //value={email}
                placeholder="Enter a new email"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError("");
                }}
                disabled={isUpdatingEmail}
                error={emailError}
              />

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleUpdateEmail}
                  disabled={isUpdatingEmail || !email.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-app-emerald-400 transition-colors duration-200 hover:bg-app-hover-emerald disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Save email"
                >
                  <span className="text-md font-bold">✓</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isUpdatingEmail}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-app-rose-600 transition-colors duration-200 hover:bg-app-hover-rose disabled:cursor-not-allowed disabled:opacity-50"
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
              <p className="text-lg text-app-slate-500">••••••</p>

              <button
                type="button"
                onClick={() => setIsEditingPassword(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-app-hover-indigo transition-colors duration-200"
                aria-label="Change password"
              >
                <span className="text-sm">✏️</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <ValidatedInput
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                    setCurrentPasswordError("");
                  }}
                  placeholder="Current password"
                  error={currentPasswordError}
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((value) => !value)}
                  className="absolute right-3 top-3 text-app-slate-400 hover:text-app-slate-600"
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
                <ValidatedInput
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setNewPasswordError("");
                  }}
                  placeholder="New password"
                  error={newPasswordError}
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="absolute right-3 top-3 text-app-slate-400 hover:text-app-slate-600"
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
                  className="flex h-8 w-8 items-center justify-center rounded-full text-app-emerald-400 hover:bg-app-hover-emerald transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Save password"
                >
                  <span className="text-md font-bold">✓</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelPassword}
                  disabled={isChangingPassword}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-app-rose-600 hover:bg-app-hover-rose transition-colors duration-200 disabled:opacity-50"
                  aria-label="Cancel"
                >
                  <span className="text-md font-bold">✕</span>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 border-t border-slate-200 pt-5">
          <p className="mt-1 text-sm text-app-slate-500">
            Permanently delete your account and all associated data.
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount}
            className="mt-4 rounded-lg border border-app-rose-200 px-4 py-2 text-sm font-medium text-app-rose-600 transition-colors duration-200 hover:bg-app-hover-rose disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeletingAccount ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AccountDialog;
