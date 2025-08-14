import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputFieldPW = forwardRef(({ label, placeholder, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative flex items-center w-full px-4 py-2 border rounded-lg focus-within:border-indigo-500">
            <div className="flex-grow">
                <label className="block mb-1 text-xs font-light text-indigo-500 font-lexend">
                    {label || 'Password'}
                </label>
                <input
                    ref={ref}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder || label}
                    className="w-full text-base font-light bg-transparent outline-none text-zinc-900"
                    {...props}
                />
                {error && (
                    <span className="absolute left-0 text-xs text-red-500 -bottom-5 font-lexend">
                        {error}
                    </span>
                )}
            </div>
            <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="ml-3 focus:outline-none"
                tabIndex={-1}
            >
                {showPassword ? (
                    <Eye className="w-5 h-5 text-zinc-900" />
                ) : (
                    <EyeOff className="w-5 h-5 text-zinc-900" />
                )}
            </button>
        </div>
    );
});


InputFieldPW.displayName = 'InputFieldPW';

export default InputFieldPW;
