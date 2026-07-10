import { useState } from "react";
import easyImage from "../assets/easy.png";
import easyDisabledImage from "../assets/easy_disabled.png";
import hardImage from "../assets/hard.png";
import hardDisabledImage from "../assets/hard_disabled.png";
import type { Difficulty } from "../logic";
import { Button } from "./Button";

type DifficultySelectorProps = {
  activeDifficulty?: Difficulty;
  onChange?: (difficulty: Difficulty) => void;
};

const difficultyImageStyle = {
  display: "block",
  width: "auto",
  height: "clamp(18px, 3.2vw, 28px)",
  maxWidth: "100%",
} as const;

const inactiveDifficultyImageStyle = {
  ...difficultyImageStyle,
  height: "clamp(18px, 3.2vw, 28px)",
} as const;

const difficulties: Array<{
  activeImage: string;
  inactiveImage: string;
  label: string;
  value: Difficulty;
}> = [
  {
    activeImage: easyImage,
    inactiveImage: easyDisabledImage,
    label: "Easy",
    value: "easy",
  },
  {
    activeImage: hardImage,
    inactiveImage: hardDisabledImage,
    label: "Hard",
    value: "hard",
  },
];

export function DifficultySelector({
  activeDifficulty,
  onChange,
}: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("easy");
  const resolvedDifficulty = activeDifficulty ?? selectedDifficulty;
  const activeDifficultyItem =
    difficulties.find((difficulty) => difficulty.value === resolvedDifficulty) ??
    difficulties[0];

  const selectDifficulty = (difficulty: Difficulty) => {
    if (difficulty === resolvedDifficulty) {
      return;
    }

    setSelectedDifficulty(difficulty);
    onChange?.(difficulty);
  };

  return (
    <div
      className="futoshiki-level-selector"
      role="group"
      aria-label="Difficulty"
    >
      {difficulties.map((difficulty) => (
        <button
          aria-label={difficulty.label}
          aria-pressed={difficulty.value === resolvedDifficulty}
          className="futoshiki-level-selector__option"
          key={difficulty.value}
          type="button"
          onClick={() => selectDifficulty(difficulty.value)}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <img
            src={difficulty.inactiveImage}
            alt=""
            aria-hidden="true"
            style={inactiveDifficultyImageStyle}
          />
        </button>
      ))}
      <div
        className={`futoshiki-level-selector__active${
          resolvedDifficulty === "hard" ? " is-hard" : ""
        }`}
      >
        <Button
          aria-label={activeDifficultyItem.label}
          aria-pressed
          size="stretch"
          variant={resolvedDifficulty === "easy" ? "green" : "orange"}
          onClick={() => selectDifficulty(activeDifficultyItem.value)}
        >
          <img
            src={activeDifficultyItem.activeImage}
            alt=""
            aria-hidden="true"
            style={difficultyImageStyle}
          />
        </Button>
      </div>
    </div>
  );
}
