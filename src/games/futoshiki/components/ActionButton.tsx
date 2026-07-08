import type { ReactNode } from "react";
import { Button, type ButtonVariant } from "./Button";

export type ActionButtonProps = {
  children?: ReactNode;
  icon?: string;
  fullWidth?: boolean;
  variant: ButtonVariant;
  onClick?: () => void;
};

export function ActionButton({
  children,
  icon,
  fullWidth = false,
  variant,
  onClick,
}: ActionButtonProps) {
  return (
    <Button
      icon={icon}
      size={fullWidth ? "fill" : "default"}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
