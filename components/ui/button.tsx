import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gray-200 hover:bg-zinc-200/90",
        destructive: "bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90",
        outline: "border border-zinc-200 bg-white shadow-sm",
        outline_brand: "border border-brand bg-white shadow-sm text-brand",
        secondary: "bg-secondary text-white shadow-sm",
        ghost: "hover:bg-zinc-100 hover:text-zinc-900",
        plain: "bg-transparent hover:bg-inherit px-0",
        link: "text-zinc-900 underline-offset-4 hover:underline",
        brand: "bg-brand text-white hover:bg-brand/90 shadow",
        light: "bg-white",
        dark: "bg-gray-800 text-white hover:bg-black",
        warning: "bg-orange-500 text-white hover:orange-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-4 text-sm",
        xs: "h-6 px-4 text-xs",
        lg: "h-12 px-4",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading, children, ...props },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot ref={ref} {...props}>
          <>
            {React.Children.map(
              children as React.ReactElement,
              (child: React.ReactElement) => {
                return React.cloneElement(child, {
                  className: cn(buttonVariants({ variant, size }), className),
                  children: (
                    <>
                      {loading && (
                        <Loader2
                          className={cn(
                            "h-4 w-4 animate-spin",
                            children && "mr-2"
                          )}
                        />
                      )}
                      {child.props.children}
                    </>
                  ),
                });
              }
            )}
          </>
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading}
        ref={ref}
        {...props}
      >
        <>
          {loading && (
            <Loader2
              className={cn("h-4 w-4 animate-spin", children && "mr-2")}
            />
          )}
          {children}
        </>
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
