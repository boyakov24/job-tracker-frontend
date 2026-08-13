import { useState } from "react";
import { login as loginRequest } from "@/api/auth";
import { useAuth } from "@/providers/auth-provider";
import { register as registerRequest } from "@/api/auth";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function AuthPopover() {
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");

  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await loginRequest({
      email,
      password,
    });

    login(response.accessToken);

    setOpen(false);
  }

  async function handleRegister(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await registerRequest({
      email: registerEmail,
      password: registerPassword,
    });

    login(response.accessToken);

    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border mr-2 px-4 py-2 text-indigo-600 hover:bg-slate-100 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setMode("login");
              setOpen(true);
            }}
          >
            Login
          </button>

          <button
            type="button"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
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
        className="w-[400px] p-5 bg-white rounded-2xl shadow-xl border border-slate-100"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="text-sm text-muted-foreground">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-base text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-base text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-base text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="******"
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-base text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AuthPopover;
