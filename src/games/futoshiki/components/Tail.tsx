import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import tailImage from "../assets/tail.png";
import tailEditableImage from "../assets/tail_editable.png";
import tailErrorImage from "../assets/tail_error.png";
import tailSelectedImage from "../assets/tail_selected.png";

type TailVariant = "board" | "number";

type TailVisualState = {
  isGiven?: boolean;
  isInvalid?: boolean;
  isSelected?: boolean;
};

type TailProps = {
  variant: TailVariant;
  value: number | null;
  notes?: number[];
  disabled?: boolean;
  isGiven?: boolean;
  isSelected?: boolean;
  isInvalid?: boolean;
  className?: string;
  flipAnimation?: {
    delayMs: number;
    durationMs: number;
    fromIsGiven?: boolean;
    fromIsInvalid?: boolean;
    fromIsSelected?: boolean;
    fromNotes: number[];
    fromValue: number | null;
    runId: number;
  };
  resetAnimation?: {
    delayMs: number;
    durationMs: number;
    fromNotes: number[];
    fromValue: number | null;
    runId: number;
  };
  style?: CSSProperties;
  valueStyle?: CSSProperties;
  onClick?: () => void;
};

const NOTE_NUMBERS = [1, 2, 3, 4, 5];

const baseButtonStyle: CSSProperties = {
  position: "relative",
  display: "grid",
  minWidth: 0,
  minHeight: 0,
  placeItems: "center",
  padding: 0,
  border: 0,
  borderRadius: 0,
  background: "transparent",
  boxShadow: "none",
  filter: "none",
  appearance: "none",
  WebkitTapHighlightColor: "transparent",
  outline: 0,
  overflow: "visible",
  transform: "none",
};

function getTailClassName({
  variant,
  isGiven,
  isSelected,
  isInvalid,
  className: extraClassName,
}: TailProps) {
  const baseClassName =
    variant === "number"
      ? "futoshiki-tail futoshiki-number-line__tail"
      : `futoshiki-tail futoshiki-board-mock__cell${
          isGiven ? " is-given" : ""
        }${isSelected ? " is-selected" : ""}${isInvalid ? " is-invalid" : ""}`;

  return extraClassName ? `${baseClassName} ${extraClassName}` : baseClassName;
}

export function Tail(props: TailProps) {
  const {
    value,
    variant,
    notes = [],
    disabled,
    isGiven,
    isSelected,
    isInvalid,
    flipAnimation,
    resetAnimation,
    style,
    valueStyle: valueStyleOverride,
    onClick,
  } = props;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const flipFrontRef = useRef<HTMLSpanElement>(null);
  const flipBackRef = useRef<HTMLSpanElement>(null);
  const [releasedFlipBackRunId, setReleasedFlipBackRunId] = useState(0);
  const visibleNotes = value === null ? notes : [];
  const valueLabel =
    value === null
      ? visibleNotes.length > 0
        ? `notes ${visibleNotes.join(", ")}`
        : "empty"
      : String(value);
  const isBoardTile = variant === "board";
  const currentVisualState = {
    isGiven,
    isInvalid,
    isSelected,
  };
  const frontVisualState = flipAnimation
    ? {
        isGiven: flipAnimation.fromIsGiven,
        isInvalid: flipAnimation.fromIsInvalid,
        isSelected: flipAnimation.fromIsSelected,
      }
    : currentVisualState;
  const isFlipBackReleased =
    !flipAnimation ||
    flipAnimation.runId === 0 ||
    releasedFlipBackRunId === flipAnimation.runId;
  const backValue =
    flipAnimation && !isFlipBackReleased ? flipAnimation.fromValue : value;
  const backNotes =
    flipAnimation && !isFlipBackReleased ? flipAnimation.fromNotes : notes;
  const backVisualState =
    flipAnimation && !isFlipBackReleased
      ? frontVisualState
      : currentVisualState;
  const frontValue = resetAnimation
    ? resetAnimation.fromValue
    : flipAnimation
    ? flipAnimation.fromValue
    : value;
  const frontNotes = resetAnimation
    ? resetAnimation.fromNotes
    : flipAnimation
    ? flipAnimation.fromNotes
    : visibleNotes;
  const getImage = (visualState: TailVisualState) =>
    isBoardTile && visualState.isSelected
      ? tailSelectedImage
      : isBoardTile && !visualState.isGiven
      ? tailEditableImage
      : tailImage;
  const imageStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    gridArea: "1 / 1",
    objectFit: "fill",
    pointerEvents: "none",
    transition: "transform 120ms ease",
    willChange: "transform",
  };
  const errorImageStyle: CSSProperties = {
    ...imageStyle,
    zIndex: 1,
  };
  const getValueStyle = (visualState: TailVisualState): CSSProperties => ({
    position: "relative",
    zIndex: 2,
    gridArea: "1 / 1",
    color: isBoardTile
      ? visualState.isGiven
        ? "rgba(23, 21, 18, 0.9)"
        : "#1f92ea"
      : undefined,
    fontFamily: '"Futoshiki Baloo 2", system-ui, sans-serif',
    fontSize: "clamp(1.85rem, 8vw, 2.85rem)",
    fontWeight: 800,
    lineHeight: 0.82,
    pointerEvents: "none",
    transition: "transform 120ms ease",
    willChange: "transform",
    ...valueStyleOverride,
  });
  const notesStyle: CSSProperties = {
    position: "relative",
    zIndex: 2,
    display: "grid",
    width: "78%",
    height: "78%",
    gridArea: "1 / 1",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gridTemplateRows: "repeat(2, minmax(0, 1fr))",
    alignItems: "center",
    justifyItems: "center",
    color: "#07375e",
    fontFamily: '"Futoshiki Baloo 2", system-ui, sans-serif',
    fontSize: "clamp(1rem, 3.05vw, 1.08rem)",
    fontWeight: 850,
    lineHeight: 1,
    pointerEvents: "none",
  };
  const noteStyle: CSSProperties = {
    display: "grid",
    minWidth: 0,
    placeItems: "center",
  };
  const invalidGlowStyle: CSSProperties = {
    zIndex: 0,
    width: "108%",
    height: "100%",
    gridArea: "1 / 1",
    borderRadius: "24%",
    border: "2px solid rgba(255, 48, 66, 0.5)",
    boxShadow:
      "0 0 4px 1px rgba(255, 48, 66, 0.66), 0 0 4px 1px rgba(255, 48, 66, 0.28)",
    pointerEvents: "none",
  };
  const selectedGlowStyle: CSSProperties = {
    ...invalidGlowStyle,
    width: "calc(108% - 6px)",
    height: "calc(100% - 6px)",
    justifySelf: "center",
    alignSelf: "center",
    border: "2px solid rgba(43, 137, 255, 0.5)",
    boxShadow:
      "0 0 5px 4px rgba(43, 137, 255, 0.66), 0 0 2px 1px rgba(43, 137, 255, 0.28)",
  };
  const buttonStyle: CSSProperties = {
    ...baseButtonStyle,
    ...(flipAnimation
      ? {
          perspective: "165px",
          perspectiveOrigin: "50% 50%",
        }
      : undefined),
    ...(resetAnimation
      ? {
          transformOrigin: "50% 100%",
          willChange: "transform, box-shadow",
        }
      : undefined),
    ...style,
  };
  const flipFaceStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "grid",
    minWidth: 0,
    minHeight: 0,
    placeItems: "center",
    transformOrigin: "50% 50%",
    transformStyle: "preserve-3d",
    backfaceVisibility: "visible",
    willChange: "transform, opacity",
  };
  useEffect(() => {
    if (
      !flipAnimation ||
      flipAnimation.runId === 0 ||
      !flipFrontRef.current ||
      !flipBackRef.current
    ) {
      setReleasedFlipBackRunId(0);
      return;
    }

    const releaseBackContentTimeoutId = window.setTimeout(() => {
      setReleasedFlipBackRunId(flipAnimation.runId);
    }, flipAnimation.delayMs);
    const frontAnimation = flipFrontRef.current.animate(
      [
        { opacity: 1, transform: "rotateY(0deg)" },
        { opacity: 0.5, offset: 0.5, transform: "rotateY(45deg)" },
        { opacity: 0, transform: "rotateY(90deg)" },
      ],
      {
        delay: flipAnimation.delayMs,
        duration: flipAnimation.durationMs,
        easing: "cubic-bezier(.45,.05,.55,.95)",
        fill: "both",
      }
    );
    const backAnimation = flipBackRef.current.animate(
      [
        { opacity: 0, transform: "rotateY(-90deg)" },
        { opacity: 0.5, offset: 0.5, transform: "rotateY(-45deg)" },
        { opacity: 1, transform: "rotateY(0deg)" },
      ],
      {
        delay: flipAnimation.delayMs,
        duration: flipAnimation.durationMs,
        easing: "cubic-bezier(.45,.05,.55,.95)",
        fill: "both",
      }
    );

    return () => {
      window.clearTimeout(releaseBackContentTimeoutId);
      frontAnimation.cancel();
      backAnimation.cancel();
    };
  }, [flipAnimation?.delayMs, flipAnimation?.durationMs, flipAnimation?.runId]);

  useEffect(() => {
    if (
      !resetAnimation ||
      resetAnimation.runId === 0 ||
      !buttonRef.current ||
      !flipFrontRef.current ||
      !flipBackRef.current
    ) {
      return;
    }

    const riseAnimation = buttonRef.current.animate(
      [
        {
          boxShadow:
            "0 5px 12px rgba(60,92,140,.07), 0 2px 4px rgba(60,92,140,.07)",
          transform: "translateY(0) scale(1) rotateX(0deg)",
        },
        {
          boxShadow:
            "0 26px 34px rgba(60,92,140,.22), 0 8px 14px rgba(60,92,140,.12)",
          offset: 0.5,
          transform: "translateY(-30%) scale(1.08) rotateX(-16deg)",
        },
        {
          boxShadow:
            "0 5px 12px rgba(60,92,140,.07), 0 2px 4px rgba(60,92,140,.07)",
          transform: "translateY(0) scale(1) rotateX(0deg)",
        },
      ],
      {
        delay: resetAnimation.delayMs,
        duration: resetAnimation.durationMs,
        easing: "cubic-bezier(.34,.9,.4,1)",
      }
    );
    const frontContentAnimation = flipFrontRef.current.animate(
      [{ opacity: 1 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }],
      {
        delay: resetAnimation.delayMs,
        duration: resetAnimation.durationMs,
        easing: "ease-in",
        fill: "both",
      }
    );
    const backContentAnimation = flipBackRef.current.animate(
      [{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 1 }],
      {
        delay: resetAnimation.delayMs,
        duration: resetAnimation.durationMs,
        easing: "ease-out",
        fill: "both",
      }
    );

    return () => {
      riseAnimation.cancel();
      frontContentAnimation.cancel();
      backContentAnimation.cancel();
    };
  }, [
    resetAnimation?.delayMs,
    resetAnimation?.durationMs,
    resetAnimation?.runId,
  ]);

  const renderTailChrome = (visualState: TailVisualState) => (
    <>
      <img
        className="futoshiki-tail__image"
        src={getImage(visualState)}
        alt=""
        aria-hidden="true"
        style={imageStyle}
      />
      {isBoardTile && visualState.isSelected && !visualState.isInvalid && (
        <span aria-hidden="true" style={selectedGlowStyle} />
      )}
      {visualState.isInvalid && (
        <span aria-hidden="true" style={invalidGlowStyle} />
      )}
      {visualState.isInvalid && (
        <img
          className="futoshiki-tail__image futoshiki-tail__image--error"
          src={tailErrorImage}
          alt=""
          aria-hidden="true"
          style={errorImageStyle}
        />
      )}
    </>
  );

  const renderTailTextContent = (
    contentValue: number | null,
    contentNotes: number[],
    visualState: TailVisualState
  ) => {
    const contentVisibleNotes = contentValue === null ? contentNotes : [];

    return (
      <>
        {contentVisibleNotes.length > 0 && (
          <span
            className="futoshiki-tail__notes"
            aria-hidden="true"
            style={notesStyle}
          >
            {NOTE_NUMBERS.map((noteNumber) => (
              <span
                className="futoshiki-tail__note"
                key={noteNumber}
                style={noteStyle}
              >
                {contentVisibleNotes.includes(noteNumber) ? noteNumber : ""}
              </span>
            ))}
          </span>
        )}
        {contentValue !== null && (
          <span
            className="futoshiki-tail__value"
            style={getValueStyle(visualState)}
          >
            {contentValue}
          </span>
        )}
      </>
    );
  };

  const renderTailContent = (
    contentValue: number | null,
    contentNotes: number[],
    visualState: TailVisualState
  ) => (
    <>
      {renderTailChrome(visualState)}
      {renderTailTextContent(contentValue, contentNotes, visualState)}
    </>
  );

  return (
    <button
      ref={buttonRef}
      className={getTailClassName(props)}
      type="button"
      disabled={disabled ?? isGiven}
      aria-label={`${valueLabel} tile`}
      style={buttonStyle}
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {isBoardTile ? (
        <>
          <span
            ref={flipFrontRef}
            className="futoshiki-tail__flip-face futoshiki-tail__flip-face--front"
            aria-hidden="true"
            style={flipFaceStyle}
          >
            {renderTailContent(
              frontValue,
              frontNotes,
              resetAnimation ? currentVisualState : frontVisualState
            )}
          </span>
          <span
            ref={flipBackRef}
            className="futoshiki-tail__flip-face futoshiki-tail__flip-face--back"
            aria-hidden="true"
            style={{ ...flipFaceStyle, opacity: 0 }}
          >
            {renderTailContent(backValue, backNotes, backVisualState)}
          </span>
        </>
      ) : (
        renderTailContent(value, visibleNotes, currentVisualState)
      )}
    </button>
  );
}
