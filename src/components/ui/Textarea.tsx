"use client";

import { TextareaHTMLAttributes, ForwardedRef, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg border
            bg-white dark:bg-slate-700
            text-slate-900 dark:text-white
            placeholder-slate-400 dark:placeholder-slate-500
            border-slate-300 dark:border-slate-600
            focus:border-indigo-500 dark:focus:border-indigo-400
            focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
            focus:ring-opacity-20 focus:ring-inset
            transition-all duration-200
            resize-none
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

Textarea.displayName = "Textarea";

export default Textarea;
