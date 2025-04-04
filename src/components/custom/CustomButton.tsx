import * as React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/libs/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";

// 버튼의 기본 스타일을 정의한 cva
const customButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90 shadow",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "text-red-600 border border-red-200 bg-white hover:bg-red-50",
        edit: "text-blue-600 border border-blue-200 hover:bg-blue-50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

// 원래 Button 컴포넌트의 props를 확장
export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof customButtonVariants> {
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

type ShadcnButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ShadcnButtonSize = "default" | "sm" | "lg" | "icon";

// Button 컴포넌트를 래핑한 커스텀 버튼
const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, children, icon, fullWidth = false, ...props }, ref) => {    
    return (
      <ShadcnButton
        className={cn(customButtonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        variant={(variant || "default") as ShadcnButtonVariant}
        size={(size || "default") as ShadcnButtonSize}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </ShadcnButton>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton, customButtonVariants }; 