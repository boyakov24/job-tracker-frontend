import type { InputHTMLAttributes } from "react";

type ValidatedInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

function ValidatedInput({
  error,
  className = "",
  ...props
}: ValidatedInputProps) {
  const hasError = Boolean(error);

  return (
    <div className="space-y-1.5">
      <input
        {...props}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-base text-app-slate-900 placeholder-app-slate-400 outline-none transition-all ${
          hasError
            ? "border-app-rose-400 focus:border-app-rose-500 focus:ring-2 focus:ring-app-rose-500/20"
            : "border-slate-200 focus:border-app-indigo-500 focus:ring-2 focus:ring-app-indigo-500/20"
        } ${className}`}
      />

      {hasError && <p className="text-sm text-app-rose-600">{error}</p>}
    </div>
  );
}

export default ValidatedInput;
