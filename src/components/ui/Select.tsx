"use client";

import { SelectHTMLAttributes, ForwardedRef, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-muted mb-1"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg border
            bg-surface dark:bg-surface
            text-foreground dark:text-foreground
            border-border dark:border-border
            focus:border-accent dark:focus:border-accent
            focus:ring-2 focus:ring-accent/50
            focus:ring-opacity-20 focus:ring-inset
            transition-all duration-200
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
