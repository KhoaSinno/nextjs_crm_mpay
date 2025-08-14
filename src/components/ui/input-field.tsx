"use client";

import { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, placeholder, type = "text", error, ...props }, ref) => (
    <div className="relative flex-1 h-14">
      <input
        ref={ref}
        type={type}
        placeholder={placeholder || label}
        className={`w-full h-full px-4 rounded-[10px] border text-base font-light font-lexend text-zinc-900 placeholder:text-zinc-400/80 focus:outline-none focus:ring-1 
                ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-400/20 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
        {...props}
      />
      {error && (
        <span className="absolute left-0 -bottom-5 text-xs text-red-500 font-lexend">
          {error}
        </span>
      )}
    </div>
  )
);

InputField.displayName = "InputField";
