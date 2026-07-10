import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import downArrowImage from "../assets/down_arrow.png";
import downArrowErrorImage from "../assets/down_arrow_error.png";
import leftArrowImage from "../assets/left_arrow.png";
import leftArrowErrorImage from "../assets/left_arrow_error.png";
import rightArrowImage from "../assets/right_arrow.png";
import rightArrowErrorImage from "../assets/right_arrow_error.png";
import upArrowImage from "../assets/up_arrow.png";
import upArrowErrorImage from "../assets/up_arrow_error.png";
import type { ArrowDirection } from "../logic";

type ArrowProps = {
  direction?: ArrowDirection;
  orientation: "horizontal" | "vertical";
  isInvalid?: boolean;
  newGameAnimation?: {
    delayMs: number;
    fromDirection?: ArrowDirection;
    fromIsInvalid?: boolean;
    runId: number;
  };
  resetAnimation?: {
    delayMs: number;
    durationMs: number;
    runId: number;
  };
  scale?: number;
};

const arrowImages: Record<ArrowDirection, string> = {
  down: downArrowImage,
  left: leftArrowImage,
  right: rightArrowImage,
  up: upArrowImage,
};

const arrowErrorImages: Record<ArrowDirection, string> = {
  down: downArrowErrorImage,
  left: leftArrowErrorImage,
  right: rightArrowErrorImage,
  up: upArrowErrorImage,
};

const arrowOffsets: Record<ArrowDirection, { x: number; y: number }> = {
  down: { x: 0, y: -6 },
  left: { x: -5, y: 0 },
  right: { x: -4, y: 0 },
  up: { x: 0, y: -5 },
};

const arrowSlotStyle: CSSProperties = {
  position: "relative",
  zIndex: 3,
  display: "grid",
  minWidth: 0,
  minHeight: 0,
  placeItems: "center",
};

function getArrowGlyphStyle(
  direction: ArrowDirection,
  scale: number
): CSSProperties {
  const offset = arrowOffsets[direction];

  return {
    display: "block",
    width: "auto",
    height: "auto",
    maxWidth: "none",
    objectFit: "contain",
    pointerEvents: "none",
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
  };
}

export function Arrow({
  direction,
  orientation,
  isInvalid,
  newGameAnimation,
  resetAnimation,
  scale = 0.5,
}: ArrowProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [switchedRunId, setSwitchedRunId] = useState(0);
  const resetRisePercent = orientation === "horizontal" ? 30 : 100;
  const isHoldingPreviousArrow =
    newGameAnimation !== undefined &&
    newGameAnimation.runId !== 0 &&
    switchedRunId !== newGameAnimation.runId;
  const visibleDirection = isHoldingPreviousArrow
    ? newGameAnimation.fromDirection
    : direction;
  const visibleIsInvalid = isHoldingPreviousArrow
    ? newGameAnimation.fromIsInvalid
    : isInvalid;

  useEffect(() => {
    if (!newGameAnimation || newGameAnimation.runId === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSwitchedRunId(newGameAnimation.runId);
    }, newGameAnimation.delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [newGameAnimation?.delayMs, newGameAnimation?.runId]);

  useEffect(() => {
    if (!resetAnimation || resetAnimation.runId === 0 || !slotRef.current) {
      return;
    }

    const animation = slotRef.current.animate(
      [
        { transform: "translateY(0) scale(1) rotateX(0deg)" },
        {
          offset: 0.5,
          transform: `translateY(-${resetRisePercent}%) scale(1.08) rotateX(-16deg)`,
        },
        { transform: "translateY(0) scale(1) rotateX(0deg)" },
      ],
      {
        delay: resetAnimation.delayMs,
        duration: resetAnimation.durationMs,
        easing: "cubic-bezier(.34,.9,.4,1)",
      }
    );

    return () => {
      animation.cancel();
    };
  }, [
    resetAnimation?.delayMs,
    resetAnimation?.durationMs,
    resetAnimation?.runId,
    resetRisePercent,
  ]);

  return (
    <div
      ref={slotRef}
      className={`futoshiki-board-mock__arrow is-${orientation}${
        visibleDirection ? "" : " is-empty"
      }${visibleIsInvalid ? " is-invalid" : ""}`}
      style={arrowSlotStyle}
    >
      {visibleDirection && (
        <img
          className={`futoshiki-board-mock__arrow-glyph is-${visibleDirection}`}
          src={
            visibleIsInvalid
              ? arrowErrorImages[visibleDirection]
              : arrowImages[visibleDirection]
          }
          alt=""
          aria-hidden="true"
          style={getArrowGlyphStyle(visibleDirection, scale)}
        />
      )}
    </div>
  );
}
