import type { ReactNode } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "./Button";

export type ActionButtonProps = {
  children?: ReactNode;
  className?: string;
  icon?: string;
  fullWidth?: boolean;
  size?: ButtonSize;
  variant: ButtonVariant;
  onClick?: () => void;
};

export function ActionButton({
  children,
  className,
  icon,
  fullWidth = false,
  size,
  variant,
  onClick,
}: ActionButtonProps) {
  return (
    <Button
      className={className}
      icon={icon}
      size={fullWidth ? "fill" : size}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
