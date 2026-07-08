import type { ReactNode } from "react";
import { Button, type ButtonVariant } from "./Button";

export type ActionButtonProps = {
  children?: ReactNode;
  className?: string;
  icon?: string;
  fullWidth?: boolean;
  variant: ButtonVariant;
  onClick?: () => void;
};

export function ActionButton({
  children,
  className,
  icon,
  fullWidth = false,
  variant,
  onClick,
}: ActionButtonProps) {
  return (
    <Button
      className={className}
      icon={icon}
      size={fullWidth ? "fill" : "default"}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
