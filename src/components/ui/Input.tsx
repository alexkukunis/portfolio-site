"use client";

import { InputHTMLAttributes, ForwardedRef, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-muted mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg border
            bg-surface dark:bg-surface
            text-foreground dark:text-foreground
            placeholder-slate-400 dark:placeholder-slate-500
            border-border dark:border-border
            focus:border-accent dark:focus:border-accent
            focus:ring-2 focus:ring-accent/50
            focus:ring-opacity-20 focus:ring-inset
            transition-all duration-200
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
