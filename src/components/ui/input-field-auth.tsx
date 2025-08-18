import { forwardRef } from "react";

export const InputFieldAuth = forwardRef(
  (
    {
      label,
      placeholder,
      type = "text",
      error,
      ...props
    }: { label?: string; placeholder?: string; type?: string; error?: string },
    ref: React.Ref<HTMLInputElement>
  ) => (
    <div className="relative w-full px-4 py-2 border border-indigo-500 rounded-lg">
      <label className="block mb-1 text-xs font-light text-indigo-500 font-lexend">
        Email Address
      </label>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder || label}
        // defaultValue="robertallen@example.com"
        className={`w-full text-base font-light bg-transparent outline-none text-zinc-900 placeholder-zinc-400 
                ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-400/20 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
        {...props}
      />
      {error && (
        <span className="absolute left-0 text-xs text-red-500 -bottom-5 font-lexend">
          {error}
        </span>
      )}
    </div>
  )
);

InputFieldAuth.displayName = "InputFieldAuth";

// export default InputFieldAuth;
