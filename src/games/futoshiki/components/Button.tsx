import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { useEffect, useState } from "react";
import blueKeyImage from "../assets/blue_key.png";
import brownKeyImage from "../assets/brown_key.png";
import greenKeyImage from "../assets/green_key.png";
import lightBlueKeyImage from "../assets/light_blue_key.png";
import orangeKeyImage from "../assets/orange_key.png";
import purpleKeyImage from "../assets/purple_key.png";
import redKeyImage from "../assets/red_key.png";
import yellowKeyImage from "../assets/yellow_key.png";

export type ButtonSize = "default" | "fill" | "stretch" | number;

export type ButtonVariant =
  | "blue"
  | "brown"
  | "green"
  | "lightBlue"
  | "orange"
  | "red"
  | "yellow"
  | "purple";

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  icon?: string;
  size?: ButtonSize;
  variant: ButtonVariant;
};

const ACTION_SIZE = "clamp(48px, 10vw, 60px)";
const BUTTON_RADIUS = "clamp(9.12px, 1.9vw, 11.4px)";
const FACE_SIZE = "clamp(45.36px, 9.45vw, 56.7px)";
const CAP_SIZE = "clamp(22.68px, 4.725vw, 28.35px)";
const FACE_MARGIN = "clamp(1.32px, 0.275vw, 1.65px)";
const ICON_SIZE = "clamp(19.1px, 3.98vw, 23.88px)";
const TEXT_PADDING_INLINE = "clamp(13.44px, 2.8vw, 16.8px)";

type ButtonAppearance =
  | {
      type: "image";
      image: string;
    }
  | {
      type: "color";
      color: string;
    };

const buttonAppearances: Record<ButtonVariant, ButtonAppearance> = {
  blue: { type: "image", image: blueKeyImage },
  brown: { type: "image", image: brownKeyImage },
  green: { type: "image", image: greenKeyImage },
  lightBlue: { type: "image", image: lightBlueKeyImage },
  orange: { type: "image", image: orangeKeyImage },
  purple: { type: "image", image: purpleKeyImage },
  red: { type: "image", image: redKeyImage },
  yellow: { type: "image", image: yellowKeyImage },
};

const centerSliceCache = new Map<string, string>();

function useCenterSlice(image: string) {
  const [centerSlice, setCenterSlice] = useState(
    () => centerSliceCache.get(image) ?? image
  );

  useEffect(() => {
    if (!image) {
      setCenterSlice("");
      return;
    }

    const cachedSlice = centerSliceCache.get(image);

    if (cachedSlice) {
      setCenterSlice(cachedSlice);
      return;
    }

    setCenterSlice(image);

    let isCancelled = false;
    const sourceImage = new Image();

    sourceImage.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const sourceX = Math.floor(sourceImage.naturalWidth / 2);

      canvas.width = 1;
      canvas.height = sourceImage.naturalHeight;
      context?.drawImage(
        sourceImage,
        sourceX,
        0,
        1,
        sourceImage.naturalHeight,
        0,
        0,
        1,
        sourceImage.naturalHeight
      );

      const slice = canvas.toDataURL("image/png");
      centerSliceCache.set(image, slice);

      if (!isCancelled) {
        setCenterSlice(slice);
      }
    };

    sourceImage.onerror = () => {
      if (!isCancelled) {
        setCenterSlice(image);
      }
    };

    sourceImage.src = image;

    return () => {
      isCancelled = true;
    };
  }, [image]);

  return centerSlice;
}

export function Button({
  children,
  icon,
  size = "default",
  variant,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  onMouseEnter,
  onMouseLeave,
  style,
  ...buttonProps
}: ButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isFill = size === "fill";
  const isStretch = size === "stretch";
  const isCustomSize = typeof size === "number";
  const actionSize = isCustomSize ? `${size}px` : ACTION_SIZE;
  const buttonRadius = isCustomSize ? `${size * 0.19}px` : BUTTON_RADIUS;
  const faceSize = isCustomSize ? `${size * 0.945}px` : FACE_SIZE;
  const capSize = isCustomSize ? `${size * 0.4725}px` : CAP_SIZE;
  const faceMargin = isCustomSize ? `${size * 0.0275}px` : FACE_MARGIN;
  const iconSize = isCustomSize ? `${size * 0.398}px` : ICON_SIZE;
  const textPaddingInline = isCustomSize
    ? `${size * 0.28}px`
    : TEXT_PADDING_INLINE;
  const appearance = buttonAppearances[variant];
  const keyImage = appearance.type === "image" ? appearance.image : undefined;
  const centerSlice = useCenterSlice(keyImage ?? "");
  const hasTextContent = children !== undefined && children !== null;

  const buttonStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    display: "inline-flex",
    width:
      isFill || isStretch ? "100%" : isCustomSize ? actionSize : "max-content",
    height: isFill ? "auto" : isStretch ? "100%" : actionSize,
    minWidth: isFill || isStretch ? 0 : actionSize,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: isFill ? "1" : undefined,
    padding: 0,
    border: 0,
    borderRadius: isFill ? "19%" : buttonRadius,
    color: isHovered ? "#fff" : "rgba(255, 255, 255, 0.94)",
    background:
      isFill || isStretch || appearance.type === "image"
        ? "transparent"
        : "#090101",
    fontSize: "1rem",
    fontWeight: hasTextContent ? 850 : isFill ? 400 : undefined,
    lineHeight: 1,
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
    WebkitTouchCallout: "none",
    appearance: "none",
    ...style,
  };

  const faceStyle: CSSProperties = {
    position: "relative",
    display: "grid",
    width: isFill ? "96%" : isStretch ? "100%" : "max-content",
    minWidth: faceSize,
    height: isStretch ? "100%" : "96%",
    gridTemplateColumns: `${capSize} minmax(0, 1fr) ${capSize}`,
    gridTemplateRows: "100%",
    marginInline: isFill || isStretch ? undefined : faceMargin,
    overflow: "hidden",
    borderRadius: "17%",
    backfaceVisibility: "hidden",
    pointerEvents: "none",
    transition: "transform 120ms ease",
    transform: `translateZ(0) scale(${isActive ? 0.94 : 1})`,
    willChange: "transform",
  };

  const capStyle: CSSProperties = {
    minWidth: 0,
    height: "100%",
    backgroundColor: appearance.type === "color" ? appearance.color : undefined,
    backgroundImage: keyImage ? `url(${keyImage})` : undefined,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${faceSize} 100%`,
  };

  const leftCapStyle: CSSProperties = {
    ...capStyle,
    gridColumn: "1",
    gridRow: "1",
    backgroundPosition: "left center",
  };

  const centerStyle: CSSProperties = {
    gridColumn: "2",
    gridRow: "1",
    minWidth: 0,
    height: "100%",
    backgroundColor: appearance.type === "color" ? appearance.color : undefined,
    backgroundImage: keyImage ? `url(${centerSlice})` : undefined,
    backgroundRepeat: "repeat-x",
    backgroundSize: "1px 100%",
    backgroundPosition: "center",
  };

  const rightCapStyle: CSSProperties = {
    ...capStyle,
    gridColumn: "3",
    gridRow: "1",
    backgroundPosition: "right center",
  };

  const contentStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    gridColumn: "1 / -1",
    gridRow: "1",
    display: "flex",
    minWidth: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: icon && hasTextContent ? "0.35em" : undefined,
    paddingInline: hasTextContent ? textPaddingInline : 0,
    whiteSpace: "nowrap",
    pointerEvents: "none",
  };

  const iconStyle: CSSProperties = {
    display: "block",
    width: hasTextContent ? "1.25em" : iconSize,
    height: hasTextContent ? "1.25em" : iconSize,
    flex: "0 0 auto",
    background: icon ? `url(${icon}) center / contain no-repeat` : undefined,
    opacity: 1,
    pointerEvents: "none",
  };

  return (
    <button
      {...buttonProps}
      style={buttonStyle}
      type="button"
      onMouseEnter={(event) => {
        setIsHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setIsHovered(false);
        setIsActive(false);
        onMouseLeave?.(event);
      }}
      onPointerDown={(event) => {
        setIsActive(true);
        event.stopPropagation();
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        setIsActive(false);
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        setIsActive(false);
        onPointerCancel?.(event);
      }}
      onPointerLeave={(event) => {
        setIsActive(false);
        onPointerLeave?.(event);
      }}
    >
      <span style={faceStyle}>
        <span aria-hidden="true" style={leftCapStyle} />
        <span aria-hidden="true" style={centerStyle} />
        <span aria-hidden="true" style={rightCapStyle} />
        {icon || hasTextContent ? (
          <span style={contentStyle}>
            {icon ? <span aria-hidden="true" style={iconStyle} /> : null}
            {children}
          </span>
        ) : null}
      </span>
    </button>
  );
}
