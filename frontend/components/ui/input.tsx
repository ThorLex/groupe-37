import React, { forwardRef } from "react";
import { cn } from "@/utils/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error = false, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
            icon ? "pl-10" : "pl-4",
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;