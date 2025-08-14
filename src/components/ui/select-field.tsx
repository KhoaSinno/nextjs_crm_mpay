"use client";

import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  placeholder?: string;
  error?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, placeholder, error, ...props }, ref) => (
    <div className="relative flex-1 h-14">
      <select
        ref={ref}
        className={`w-full h-full px-4 pr-10 rounded-[10px] border text-base font-light font-lexend text-zinc-900 focus:outline-none focus:ring-1 appearance-none bg-white
                ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-400/20 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
        {...props}
      >
        <option value="" disabled>
          {placeholder || label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
        <ChevronDown className="w-5 h-5 text-zinc-900" />
      </div>
      {error && (
        <span className="absolute left-0 text-xs text-red-500 -bottom-5 font-lexend">
          {error}
        </span>
      )}
    </div>
  )
);

SelectField.displayName = "SelectField";
