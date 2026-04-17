import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[--radius-sm] font-sans font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:shadow-[0_6px_24px_rgb(0_0_0/0.12)]",
        secondary: "bg-transparent text-fg border border-border hover:border-border-strong hover:bg-bg-elevated",
        ghost: "bg-transparent text-fg hover:underline underline-offset-4 decoration-from-font",
      },
      size: {
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[15px]",
        sm: "h-9 px-4 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
