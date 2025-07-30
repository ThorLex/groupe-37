import React, { forwardRef } from "react";
import { cn } from "@/utils/utils"; 

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate = false, ...props }, ref) => {
    return (
      <label className={cn("flex items-center cursor-pointer", className)}>
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
            { "opacity-50 cursor-not-allowed": props.disabled }
          )}
          style={indeterminate ? { opacity: 0.5 } : undefined}
          {...props}
        />
        {label && (
          <span className="ml-2 text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;