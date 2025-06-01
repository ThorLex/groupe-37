import { buttonVariants, ButtonVariantsProps } from "@/utils/button-variant";
import { cn } from "@/utils/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantsProps {}

const NavButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

NavButton.displayName = "Button";

export default NavButton;