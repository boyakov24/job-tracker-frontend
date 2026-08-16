import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import { login as loginRequest } from "@/api/auth";
import { useAuth } from "@/providers/auth-provider";
import { register as registerRequest } from "@/api/auth";
import ValidatedInput from "../ui/validated-input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function AuthPopover() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showLogPassword, setShowLogPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [showRegPassword, setShowRegPassword] = useState(false);

  const [registerEmailError, setRegisterEmailError] = useState("");
  const [registerPasswordError, setRegisterPasswordError] = useState("");

  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");

  const resetPopoverState = () => {
    setEmail("");
    setPassword("");

    setShowLogPassword(false);

    setEmailError("");
    setPasswordError("");

    setRegisterEmail("");
    setRegisterPassword("");

    setShowRegPassword(false);

    setRegisterEmailError("");
    setRegisterPasswordError("");

    setIsLoading(false);
  };

  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    let hasError = false;

    if (!email.trim()) {
      setEmailError("This field is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email is invalid");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("This field is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      const response = await loginRequest({
        email,
        password,
      });

      login(response.accessToken);
      setOpen(false);
      //resetPopoverState();
    } catch (error) {
      console.error("Login failed:", error);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setPasswordError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message[0]
            : error.response.data.message,
        );
      } else {
        setPasswordError("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    let hasError = false;

    if (!registerEmail.trim()) {
      setRegisterEmailError("This field is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)) {
      setRegisterEmailError("Email is invalid");
      hasError = true;
    } else {
      setRegisterEmailError("");
    }

    if (!registerPassword.trim()) {
      setRegisterPasswordError("This field is required");
      hasError = true;
    } else if (registerPassword.length < 6) {
      setRegisterPasswordError("Password must be at least 6 characters");
      hasError = true;
    } else {
      setRegisterPasswordError("");
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      const response = await registerRequest({
        email: registerEmail,
        password: registerPassword,
      });

      login(response.accessToken);

      setOpen(false);
      resetPopoverState();
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setRegisterEmailError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message[0]
            : error.response.data.message,
        );
      } else {
        setPasswordError("This email is already registered");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetPopoverState();
        }

        setOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border mr-2 px-4 py-2 text-app-indigo-600 hover:bg-app-slate-100 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              resetPopoverState();
              setMode("login");
              setOpen(true);
            }}
          >
            Login
          </button>

          <button
            type="button"
            className="rounded-md bg-app-indigo-600 px-4 py-2 text-app-white hover:bg-app-indigo-700 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              resetPopoverState();
              setMode("register");
              setOpen(true);
            }}
          >
            Register
          </button>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[400px] p-5 bg-app-white rounded-2xl shadow-xl border border-app-slate-100"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="text-sm text-muted-foreground">
          {mode === "login" ? (
            <form
              onSubmit={handleLogin}
              noValidate
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-app-slate-700">
                  Email
                </label>
                <ValidatedInput
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError("");
                  }}
                  error={emailError}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-app-slate-700">
                  Password
                </label>
                <div className="relative">
                  <ValidatedInput
                    type={showLogPassword ? "text" : "password"}
                    placeholder="••••••"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setPasswordError("");
                    }}
                    error={passwordError}
                  />

                  <button
                    type="button"
                    onClick={() => setShowLogPassword((value) => !value)}
                    className="absolute right-3 top-3 text-app-slate-400 hover:text-app-slate-600"
                    aria-label={
                      showLogPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showLogPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 rounded-lg bg-app-indigo-600 py-3 font-semibold text-app-white transition-colors duration-200 hover:bg-app-indigo-700 focus:outline-none focus:ring-2 focus:ring-app-indigo-500 focus:ring-offset-2"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegister}
              noValidate
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-app-slate-700">
                  Email
                </label>
                <ValidatedInput
                  type="email"
                  placeholder="example@mail.com"
                  value={registerEmail}
                  onChange={(event) => {
                    setRegisterEmail(event.target.value);
                    setRegisterEmailError("");
                  }}
                  error={registerEmailError}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-app-slate-700">
                  Password
                </label>
                <div className="relative">
                  <ValidatedInput
                    type={showRegPassword ? "text" : "password"}
                    placeholder="••••••"
                    value={registerPassword}
                    onChange={(event) => {
                      setRegisterPassword(event.target.value);
                      setRegisterPasswordError("");
                    }}
                    error={registerPasswordError}
                  />

                  <button
                    type="button"
                    onClick={() => setShowRegPassword((value) => !value)}
                    className="absolute right-3 top-3 text-app-slate-400 hover:text-app-slate-600"
                    aria-label={
                      showRegPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showRegPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 rounded-lg bg-app-indigo-600 py-3 font-semibold text-app-white transition-colors duration-200 hover:bg-app-indigo-700 focus:outline-none focus:ring-2 focus:ring-app-indigo-500 focus:ring-offset-2"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AuthPopover;
