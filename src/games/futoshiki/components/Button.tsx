import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
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
  disablePressedGlow?: boolean;
  icon?: string;
  pressing?: boolean;
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
const ACTIVE_RELEASE_DELAY_MS = 80;

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

const buttonPressedGlows: Record<
  ButtonVariant,
  { border: string; boxShadow: string }
> = {
  blue: {
    border: "2px solid rgba(43, 92, 255, 0.5)",
    boxShadow:
      "0 0 5px 4px rgba(43, 92, 255, 0.66), 0 0 2px 1px rgba(43, 92, 255, 0.28)",
  },
  brown: {
    border: "2px solid rgba(137, 75, 36, 0.5)",
    boxShadow:
      "0 0 5px 4px rgba(137, 75, 36, 0.66), 0 0 2px 1px rgba(137, 75, 36, 0.28)",
  },
  green: {
    border: "2px solid rgba(58, 186, 94, 0.5)",
    boxShadow:
      "0 0 5px 4px rgba(58, 186, 94, 0.66), 0 0 2px 1px rgba(58, 186, 94, 0.28)",
  },
  lightBlue: {
    border: "2px solid rgba(43, 137, 255, 0.5)",
    boxShadow:
      "0 0 5px 4px rgba(43, 137, 255, 0.66), 0 0 2px 1px rgba(43, 137, 255, 0.28)",
  },
  orange: {
    border: "2px solid rgba(255, 145, 43, 0.5)",
    boxShadow:
      "0 0 5px 4px rgba(255, 145, 43, 0.66), 0 0 2px 1px rgba(255, 145, 43, 0.28)",
  },
  purple: {
    border: "2px solid rgba(153, 83, 255, 0.5)",
    boxShadow:
      "0 0 5px 4px rgba(153, 83, 255, 0.66), 0 0 2px 1px rgba(153, 83, 255, 0.28)",
  },
  red: {
    border: "2px solid rgba(255, 48, 66, 0.5)",
    boxShadow:
      "0 0 5px 4px rgba(255, 48, 66, 0.66), 0 0 2px 1px rgba(255, 48, 66, 0.28)",
  },
  yellow: {
    border: "2px solid rgba(255, 209, 43, 0.5)",
    boxShadow:
      "0 0 5px 4px rgba(255, 209, 43, 0.66), 0 0 2px 1px rgba(255, 209, 43, 0.28)",
  },
};

type ButtonImageParts = {
  capAspectRatio: string;
  capAspectRatioValue: number;
  centerSlice: string;
  hasSlices: boolean;
  image: string;
  leftCapSlice: string;
  rightCapSlice: string;
};

const imagePartsCache = new Map<string, ButtonImageParts>();

function createButtonImageParts(image: string): ButtonImageParts {
  return {
    capAspectRatio: "0.5 / 1",
    capAspectRatioValue: 0.5,
    centerSlice: image,
    hasSlices: false,
    image,
    leftCapSlice: image,
    rightCapSlice: image,
  };
}

function createImageSlice(
  sourceImage: HTMLImageElement,
  sourceX: number,
  sourceWidth: number
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = sourceWidth;
  canvas.height = sourceImage.naturalHeight;
  context?.drawImage(
    sourceImage,
    sourceX,
    0,
    sourceWidth,
    sourceImage.naturalHeight,
    0,
    0,
    sourceWidth,
    sourceImage.naturalHeight
  );

  return canvas.toDataURL("image/png");
}

function useButtonImageParts(image: string | undefined) {
  const requestedImage = image ?? "";
  const [resolvedParts, setResolvedParts] = useState(() =>
    createButtonImageParts(requestedImage)
  );

  useEffect(() => {
    if (!requestedImage) {
      setResolvedParts(createButtonImageParts(""));
      return;
    }

    const cachedParts = imagePartsCache.get(requestedImage);

    if (cachedParts) {
      setResolvedParts(cachedParts);
      return;
    }

    let isCancelled = false;
    const sourceImage = new Image();

    sourceImage.onload = () => {
      const centerX = Math.floor(sourceImage.naturalWidth / 2);
      const capWidth = Math.ceil(sourceImage.naturalWidth / 2);
      const parts = {
        capAspectRatio: `${capWidth} / ${sourceImage.naturalHeight}`,
        capAspectRatioValue: capWidth / sourceImage.naturalHeight,
        centerSlice: createImageSlice(sourceImage, centerX, 1),
        hasSlices: true,
        image: requestedImage,
        leftCapSlice: createImageSlice(sourceImage, 0, capWidth),
        rightCapSlice: createImageSlice(
          sourceImage,
          sourceImage.naturalWidth - capWidth,
          capWidth
        ),
      };

      imagePartsCache.set(requestedImage, parts);

      if (!isCancelled) {
        setResolvedParts(parts);
      }
    };

    sourceImage.onerror = () => {
      if (!isCancelled) {
        setResolvedParts(createButtonImageParts(requestedImage));
      }
    };

    sourceImage.src = requestedImage;

    return () => {
      isCancelled = true;
    };
  }, [requestedImage]);

  const cachedParts = requestedImage
    ? imagePartsCache.get(requestedImage)
    : undefined;

  if (!requestedImage) {
    return createButtonImageParts("");
  }

  if (cachedParts) {
    return cachedParts;
  }

  if (resolvedParts.image === requestedImage) {
    return resolvedParts;
  }

  return resolvedParts;
}

export function Button({
  children,
  disablePressedGlow = false,
  icon,
  pressing = false,
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
  const [stretchFaceHeight, setStretchFaceHeight] = useState(0);
  const faceRef = useRef<HTMLSpanElement>(null);
  const releaseActiveTimeoutRef = useRef<number | null>(null);
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
  const pressedGlow = buttonPressedGlows[variant];
  const keyImage = appearance.type === "image" ? appearance.image : undefined;
  const buttonImageParts = useButtonImageParts(keyImage);
  const visibleKeyImage = buttonImageParts.image || keyImage;
  const hasTextContent = children !== undefined && children !== null;
  const isPressing = pressing || isActive;
  const isRatioPreservedStretch = isStretch && appearance.type === "image";
  const hasRatioPreservedSlices =
    isRatioPreservedStretch && buttonImageParts.hasSlices;

  const cancelScheduledActiveRelease = () => {
    if (releaseActiveTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(releaseActiveTimeoutRef.current);
    releaseActiveTimeoutRef.current = null;
  };

  const releaseActiveAfterClick = () => {
    cancelScheduledActiveRelease();
    releaseActiveTimeoutRef.current = window.setTimeout(() => {
      setIsActive(false);
      releaseActiveTimeoutRef.current = null;
    }, ACTIVE_RELEASE_DELAY_MS);
  };

  useEffect(
    () => () => {
      cancelScheduledActiveRelease();
    },
    []
  );

  useEffect(() => {
    if (!isRatioPreservedStretch) {
      setStretchFaceHeight(0);
      return;
    }

    const faceElement = faceRef.current;

    if (!faceElement) {
      return;
    }

    const updateStretchFaceHeight = () => {
      const nextHeight = faceElement.getBoundingClientRect().height;

      setStretchFaceHeight((currentHeight) =>
        Math.abs(currentHeight - nextHeight) < 0.5 ? currentHeight : nextHeight
      );
    };

    updateStretchFaceHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const resizeObserver = new ResizeObserver(updateStretchFaceHeight);
    resizeObserver.observe(faceElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isRatioPreservedStretch]);

  const stretchCapWidth =
    isRatioPreservedStretch && stretchFaceHeight > 0
      ? `${stretchFaceHeight * buttonImageParts.capAspectRatioValue}px`
      : capSize;

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
    display: isRatioPreservedStretch ? "flex" : "grid",
    width: isFill ? "96%" : isStretch ? "100%" : "max-content",
    minWidth: faceSize,
    height: isStretch ? "100%" : "96%",
    gridTemplateColumns: isRatioPreservedStretch
      ? undefined
      : `${capSize} minmax(0, 1fr) ${capSize}`,
    gridTemplateRows: isRatioPreservedStretch ? undefined : "100%",
    alignItems: isRatioPreservedStretch ? "stretch" : undefined,
    marginInline: isFill || isStretch ? undefined : faceMargin,
    overflow: isRatioPreservedStretch || isPressing ? "visible" : "hidden",
    borderRadius: isRatioPreservedStretch ? 0 : "17%",
    backfaceVisibility: "hidden",
    pointerEvents: "none",
    transition: "transform 120ms ease",
    transform: `translateZ(0) scale(${isPressing ? 0.94 : 1})`,
    willChange: "transform",
  };

  const pressedGlowStyle: CSSProperties = {
    position: "absolute",
    zIndex: 0,
    top: "50%",
    left: "50%",
    width: "calc(108% - 6px)",
    height: "calc(100% - 6px)",
    borderRadius: "24%",
    border: pressedGlow.border,
    boxShadow: pressedGlow.boxShadow,
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
  };

  const capStyle: CSSProperties = {
    display: "block",
    minWidth: 0,
    width: isRatioPreservedStretch ? stretchCapWidth : undefined,
    height: "100%",
    aspectRatio: isRatioPreservedStretch
      ? buttonImageParts.capAspectRatio
      : undefined,
    flex: isRatioPreservedStretch
      ? `0 0 ${stretchCapWidth}`
      : undefined,
    backgroundColor: appearance.type === "color" ? appearance.color : undefined,
    backgroundImage: visibleKeyImage ? `url(${visibleKeyImage})` : undefined,
    backgroundRepeat: "no-repeat",
    backgroundSize: hasRatioPreservedSlices
      ? "100% 100%"
      : isRatioPreservedStretch
        ? "auto 100%"
        : `${faceSize} 100%`,
  };

  const leftCapStyle: CSSProperties = {
    ...capStyle,
    zIndex: 1,
    gridColumn: isRatioPreservedStretch ? undefined : "1",
    gridRow: isRatioPreservedStretch ? undefined : "1",
    backgroundImage: visibleKeyImage
      ? `url(${
          hasRatioPreservedSlices
            ? buttonImageParts.leftCapSlice
            : visibleKeyImage
        })`
      : undefined,
    backgroundPosition: "left center",
  };

  const centerStyle: CSSProperties = {
    zIndex: 1,
    gridColumn: isRatioPreservedStretch ? undefined : "2",
    gridRow: isRatioPreservedStretch ? undefined : "1",
    flex: isRatioPreservedStretch ? "1 1 auto" : undefined,
    minWidth: 0,
    height: "100%",
    backgroundColor: appearance.type === "color" ? appearance.color : undefined,
    backgroundImage: visibleKeyImage
      ? `url(${buttonImageParts.centerSlice})`
      : undefined,
    backgroundRepeat: "repeat-x",
    backgroundSize: "1px 100%",
    backgroundPosition: "center",
  };

  const rightCapStyle: CSSProperties = {
    ...capStyle,
    zIndex: 1,
    gridColumn: isRatioPreservedStretch ? undefined : "3",
    gridRow: isRatioPreservedStretch ? undefined : "1",
    backgroundImage: visibleKeyImage
      ? `url(${
          hasRatioPreservedSlices
            ? buttonImageParts.rightCapSlice
            : visibleKeyImage
        })`
      : undefined,
    backgroundPosition: "right center",
  };

  const contentStyle: CSSProperties = {
    position: isRatioPreservedStretch ? "absolute" : "relative",
    inset: isRatioPreservedStretch ? 0 : undefined,
    zIndex: 2,
    gridColumn: isRatioPreservedStretch ? undefined : "1 / -1",
    gridRow: isRatioPreservedStretch ? undefined : "1",
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
        cancelScheduledActiveRelease();
        setIsActive(false);
        onMouseLeave?.(event);
      }}
      onPointerDown={(event) => {
        cancelScheduledActiveRelease();
        setIsActive(true);
        event.stopPropagation();
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        releaseActiveAfterClick();
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        cancelScheduledActiveRelease();
        setIsActive(false);
        onPointerCancel?.(event);
      }}
      onPointerLeave={(event) => {
        cancelScheduledActiveRelease();
        setIsActive(false);
        onPointerLeave?.(event);
      }}
    >
      <span ref={faceRef} style={faceStyle}>
        {isPressing && !disablePressedGlow ? (
          <span aria-hidden="true" style={pressedGlowStyle} />
        ) : null}
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
