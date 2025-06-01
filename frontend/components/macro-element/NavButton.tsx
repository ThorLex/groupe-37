"use client"

import { animationVariants, buttonVariants, ButtonVariantsProps } from "@/utils/button-variant";
import { cn } from "@/utils/utils"
import { motion, MotionProps } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react"

type OmitDragProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDragStart' | 'onDrag' | 'onDragEnd' | 'onDragCapture' | keyof MotionProps
>;

interface ButtonProps
  extends OmitDragProps,
    ButtonVariantsProps,
    MotionProps {
  animation?: keyof typeof animationVariants;
}

const NavButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, animation, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, className }))}
        variants={animation ? animationVariants[animation] : {}}
        initial="initial"
        animate="animate"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

NavButton.displayName = "Button";

export default NavButton;