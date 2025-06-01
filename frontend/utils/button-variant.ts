import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold text-[0.9rem]",
  {
    variants: {
      variant: {
        navigation: "bg-linear-to-r from-[#FF0000] to-[#008000] w-1/3 rounded-lg shadow-[0_4px_20px_0_rgba(0,0,0,0.25)] hover:shadow-[0_6px_24px_0_rgba(0,0,0,0.4)] transition all duration-300 p-1 cursor-pointer",
        language: "bg-white rounded-full w-7 h-7 text-black text-base tex-semibold p-4 cursor-pointer shadow-[0_4px_20px_0_rgba(0,0,0,0.25)]"
      },
    },
    defaultVariants: {
      variant: "navigation",
    },
  }
);

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;

export { buttonVariants };