import type { CSSProperties } from "react";
import blueKeyImage from "../assets/blue_key.png";
import greenKeyImage from "../assets/green_key.png";
import orangeKeyImage from "../assets/orange_key.png";
import purpleKeyImage from "../assets/purple_key.png";
import redKeyImage from "../assets/red_key.png";
import yellowKeyImage from "../assets/yellow_key.png";

export type ActionButtonVariant =
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "yellow"
  | "purple";

export type ActionButtonProps = {
  icon: string;
  className?: string;
  rounded?: boolean;
  variant?: ActionButtonVariant;
  onClick?: () => void;
};

const actionButtonImages: Record<ActionButtonVariant, string> = {
  blue: blueKeyImage,
  green: greenKeyImage,
  orange: orangeKeyImage,
  red: redKeyImage,
  yellow: yellowKeyImage,
  purple: purpleKeyImage,
};

export function ActionButton({
  icon,
  className = "",
  rounded = false,
  variant = "green",
  onClick,
}: ActionButtonProps) {
  const resolvedClassName = `futoshiki-board-actions__button ${className} ${
    rounded ? " is-rounded" : ""
  }`.trim();
  const style = {
    "--futoshiki-action-image": `url(${actionButtonImages[variant]})`,
    "--futoshiki-action-icon": `url(${icon})`,
  } as CSSProperties;

  return (
    <button
      className={resolvedClassName || undefined}
      style={style}
      type="button"
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <span className="futoshiki-game-button__square">
        <span className="futoshiki-game-button__inner-square">
          <span className="futoshiki-action-button__icon" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
