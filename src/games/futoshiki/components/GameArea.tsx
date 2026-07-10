import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import newIconImage from "../assets/new_icon.png";
import notesIconImage from "../assets/notes_icon.png";
import questionIconImage from "../assets/question_icon.png";
import resetIconImage from "../assets/reset_icon.png";
import type {
  BoardCell,
  BoardNotes,
  BoardValues,
  Difficulty,
  FutoshikiLevel,
} from "../logic";
import {
  BOARD_SIZE,
  getCellKey,
  isGivenCell,
  type ValidationResult,
} from "../logic";
import { ActionButton } from "./ActionButton";
import { Arrow } from "./Arrow";
import { DifficultySelector } from "./DifficultySelector";
import { Tail } from "./Tail";

type GameAreaProps = {
  boardValues: BoardValues;
  boardNotes: BoardNotes;
  selectedCell: BoardCell | null;
  validation: ValidationResult;
  difficulty: Difficulty;
  isNotesModeSelected: boolean;
  level: FutoshikiLevel;
  onOpenHelpModal: () => void;
  onResetBoard: () => void;
  onSelectCell: (cell: BoardCell) => void;
  onStartNewLevel: (difficulty?: Difficulty) => void;
  onToggleNotesMode: () => void;
};

type NewGameTailFlipAnimationConfig = {
  tailFlipMs: number;
  lineStartDelayMs: number;
};

type NewGameTailFlipProps = {
  delayMs: number;
  durationMs: number;
  runId: number;
};

type BoardContentSnapshot = {
  boardNotes: BoardNotes;
  boardValues: BoardValues;
};

type NewGameBoardSnapshot = BoardContentSnapshot & {
  level: FutoshikiLevel;
  selectedCell: BoardCell | null;
  validation: ValidationResult;
};

type ResetTailRiseAnimationConfig = {
  distanceDelayMs: number;
  tailRiseMs: number;
};

type ResetTailRiseProps = {
  delayMs: number;
  durationMs: number;
  runId: number;
};

const boardRows = Array.from({ length: 9 }, (_, rowIndex) =>
  Array.from({ length: 9 }, (_, columnIndex) => ({
    key: `${rowIndex}-${columnIndex}`,
    rowIndex,
    columnIndex,
  }))
);

const sectionStyle: CSSProperties = {
  display: "grid",
  width: "100%",
  minHeight: "clamp(260px, 44vh, 420px)",
  alignContent: "start",
  gap: "clamp(12px, 2.4vw, 22px)",
  paddingBottom: 0,
  border: 0,
  background: "transparent",
  boxShadow: "none",
  justifySelf: "center",
};

const controlsRowStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  minWidth: 0,
  alignItems: "center",
  justifyContent: "space-between",
  gap: "clamp(14px, 4vw, 32px)",
};

const boardStyle: CSSProperties = {
  display: "grid",
  width: "100%",
  aspectRatio: "1",
  justifySelf: "center",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr) minmax(18px, 0.34fr)) minmax(0, 1fr)",
  gridTemplateRows:
    "repeat(4, minmax(0, 1fr) minmax(18px, 0.34fr)) minmax(0, 1fr)",
  margin: 0,
  perspective: "900px",
  transform: "translateY(10px)",
};

const gapStyle: CSSProperties = {
  display: "grid",
  minWidth: 0,
  minHeight: 0,
  placeItems: "center",
};

const actionsStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  justifySelf: "center",
  alignItems: "center",
  justifyContent: "space-around",
  marginTop: 20,
};

const baseTailStyle: CSSProperties = {
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
  fontSize: "clamp(1.4rem, 7vw, 2.4rem)",
  fontWeight: 850,
  lineHeight: 1,
  appearance: "none",
  WebkitTapHighlightColor: "transparent",
  outline: 0,
  overflow: "visible",
  transform: "none",
  opacity: 1,
  transformStyle: "preserve-3d",
  willChange: "transform, filter",
};

function createNewGameTailFlipAnimation(
  config: NewGameTailFlipAnimationConfig
) {
  const lastDiagonalIndex = (BOARD_SIZE - 1) * 2;
  const totalDurationMs =
    lastDiagonalIndex * config.lineStartDelayMs + config.tailFlipMs;

  const getTailAnimation = (
    cell: BoardCell,
    animationRunId: number
  ): NewGameTailFlipProps | undefined => {
    if (animationRunId === 0) {
      return undefined;
    }

    const diagonalIndex = cell.rowIndex + cell.columnIndex;

    return {
      delayMs: diagonalIndex * config.lineStartDelayMs,
      durationMs: config.tailFlipMs,
      runId: animationRunId,
    };
  };

  return {
    getTailAnimation,
    totalDurationMs,
  };
}

const newGameTailFlipAnimation = createNewGameTailFlipAnimation({
  tailFlipMs: 500,
  lineStartDelayMs: 80,
});

function createResetTailRiseAnimation(config: ResetTailRiseAnimationConfig) {
  const origin = {
    rowIndex: BOARD_SIZE - 1,
    columnIndex: (BOARD_SIZE - 1) / 2,
  };
  const maxDistance = Math.hypot(BOARD_SIZE - 1, Math.floor(BOARD_SIZE / 2));
  const totalDurationMs =
    maxDistance * config.distanceDelayMs + config.tailRiseMs;

  const getTailAnimation = (
    cell: BoardCell,
    animationRunId: number
  ): ResetTailRiseProps | undefined => {
    if (animationRunId === 0) {
      return undefined;
    }

    return {
      delayMs:
        Math.hypot(
          cell.rowIndex - origin.rowIndex,
          cell.columnIndex - origin.columnIndex
        ) * config.distanceDelayMs,
      durationMs: config.tailRiseMs,
      runId: animationRunId,
    };
  };

  return {
    getTailAnimation,
    totalDurationMs,
  };
}

const resetTailRiseAnimation = createResetTailRiseAnimation({
  distanceDelayMs: 120,
  tailRiseMs: 620,
});

function cloneBoardValues(boardValues: BoardValues): BoardValues {
  return boardValues.map((row) => [...row]);
}

function cloneBoardNotes(boardNotes: BoardNotes): BoardNotes {
  return boardNotes.map((row) => row.map((notes) => [...notes]));
}

function cloneValidationResult(validation: ValidationResult): ValidationResult {
  return {
    brokenArrowKeys: new Set(validation.brokenArrowKeys),
    duplicateCellKeys: new Set(validation.duplicateCellKeys),
  };
}

function getBoardTailStyle({
  isGiven,
  isAnimating,
}: {
  isGiven: boolean;
  isAnimating: boolean;
}): CSSProperties {
  return {
    ...baseTailStyle,
    color: isGiven ? "rgba(23, 21, 18, 0.9)" : "#1f92ea",
    cursor: isGiven ? "default" : "pointer",
    pointerEvents: isAnimating ? "none" : undefined,
  };
}

export function GameArea({
  boardValues,
  boardNotes,
  selectedCell,
  validation,
  difficulty,
  isNotesModeSelected,
  level,
  onOpenHelpModal,
  onResetBoard,
  onSelectCell,
  onStartNewLevel,
  onToggleNotesMode,
}: GameAreaProps) {
  const [newGameAnimationRunId, setNewGameAnimationRunId] = useState(0);
  const [newGameAnimationSnapshot, setNewGameAnimationSnapshot] =
    useState<NewGameBoardSnapshot | null>(null);
  const [resetAnimationRunId, setResetAnimationRunId] = useState(0);
  const [resetAnimationSnapshot, setResetAnimationSnapshot] =
    useState<BoardContentSnapshot | null>(null);
  const { duplicateCellKeys, brokenArrowKeys } = validation;
  const isAnimating = newGameAnimationRunId !== 0 || resetAnimationRunId !== 0;

  const startNewLevel = (nextDifficulty?: Difficulty) => {
    if (isAnimating) {
      return;
    }

    setNewGameAnimationSnapshot({
      boardNotes: cloneBoardNotes(boardNotes),
      boardValues: cloneBoardValues(boardValues),
      level,
      selectedCell,
      validation: cloneValidationResult(validation),
    });
    onStartNewLevel(nextDifficulty);
    setNewGameAnimationRunId((currentRunId) => currentRunId + 1);
  };

  const resetBoard = () => {
    if (isAnimating) {
      return;
    }

    setResetAnimationSnapshot({
      boardNotes: cloneBoardNotes(boardNotes),
      boardValues: cloneBoardValues(boardValues),
    });
    onResetBoard();
    setResetAnimationRunId((currentRunId) => currentRunId + 1);
  };

  useEffect(() => {
    if (newGameAnimationRunId === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNewGameAnimationRunId(0);
      setNewGameAnimationSnapshot(null);
    }, newGameTailFlipAnimation.totalDurationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [newGameAnimationRunId]);

  useEffect(() => {
    if (resetAnimationRunId === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setResetAnimationRunId(0);
      setResetAnimationSnapshot(null);
    }, resetTailRiseAnimation.totalDurationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [resetAnimationRunId]);

  return (
    <section className="futoshiki-block" style={sectionStyle}>
      <div style={controlsRowStyle}>
        <ActionButton
          icon={questionIconImage}
          variant="blue"
          size={54}
          onClick={onOpenHelpModal}
        />
        <DifficultySelector
          activeDifficulty={difficulty}
          onChange={(nextDifficulty) => startNewLevel(nextDifficulty)}
        />
      </div>
      <div style={boardStyle}>
        {boardRows.flatMap((row) =>
          row.map(({ key, rowIndex, columnIndex }) => {
            const isTile = rowIndex % 2 === 0 && columnIndex % 2 === 0;
            const isHorizontalArrowSlot =
              rowIndex % 2 === 0 && columnIndex % 2 === 1;
            const isVerticalArrowSlot =
              rowIndex % 2 === 1 && columnIndex % 2 === 0;

            if (isTile) {
              const boardRowIndex = rowIndex / 2;
              const boardColumnIndex = columnIndex / 2;
              const value = boardValues[boardRowIndex][boardColumnIndex];
              const cell = {
                rowIndex: boardRowIndex,
                columnIndex: boardColumnIndex,
              };
              const isGiven = isGivenCell(level, cell);
              const hasDuplicateError = duplicateCellKeys.has(getCellKey(cell));
              const isSelected =
                selectedCell?.rowIndex === boardRowIndex &&
                selectedCell.columnIndex === boardColumnIndex;
              const flipAnimation = newGameTailFlipAnimation.getTailAnimation(
                cell,
                newGameAnimationRunId
              );
              const resetAnimation = resetTailRiseAnimation.getTailAnimation(
                cell,
                resetAnimationRunId
              );
              const previousNewGameNotes =
                newGameAnimationSnapshot
                  ? newGameAnimationSnapshot.boardNotes[boardRowIndex][
                      boardColumnIndex
                    ]
                  : boardNotes[boardRowIndex][boardColumnIndex];
              const previousNewGameValue = newGameAnimationSnapshot
                ? newGameAnimationSnapshot.boardValues[boardRowIndex][
                    boardColumnIndex
                  ]
                : value;
              const previousNewGameIsGiven = newGameAnimationSnapshot
                ? isGivenCell(newGameAnimationSnapshot.level, cell)
                : isGiven;
              const previousNewGameIsSelected = newGameAnimationSnapshot
                ? newGameAnimationSnapshot.selectedCell?.rowIndex ===
                    boardRowIndex &&
                  newGameAnimationSnapshot.selectedCell.columnIndex ===
                    boardColumnIndex
                : isSelected;
              const previousNewGameHasDuplicateError =
                newGameAnimationSnapshot?.validation.duplicateCellKeys.has(
                  getCellKey(cell)
                ) ?? hasDuplicateError;
              const previousResetNotes =
                resetAnimationSnapshot
                  ? resetAnimationSnapshot.boardNotes[boardRowIndex][
                      boardColumnIndex
                    ]
                  : boardNotes[boardRowIndex][boardColumnIndex];
              const previousResetValue = resetAnimationSnapshot
                ? resetAnimationSnapshot.boardValues[boardRowIndex][
                    boardColumnIndex
                  ]
                : value;

              return (
                <Tail
                  key={key}
                  variant="board"
                  value={value}
                  notes={boardNotes[boardRowIndex][boardColumnIndex]}
                  isGiven={isGiven}
                  isSelected={isSelected}
                  isInvalid={hasDuplicateError}
                  flipAnimation={
                    flipAnimation
                      ? {
                          ...flipAnimation,
                          fromIsGiven: previousNewGameIsGiven,
                          fromIsInvalid: previousNewGameHasDuplicateError,
                          fromIsSelected: previousNewGameIsSelected,
                          fromNotes: previousNewGameNotes,
                          fromValue: previousNewGameValue,
                        }
                      : undefined
                  }
                  resetAnimation={
                    resetAnimation
                      ? {
                          ...resetAnimation,
                          fromNotes: previousResetNotes,
                          fromValue: previousResetValue,
                        }
                      : undefined
                  }
                  style={getBoardTailStyle({
                    isGiven,
                    isAnimating,
                  })}
                  onClick={() => onSelectCell(cell)}
                />
              );
            }

            if (isHorizontalArrowSlot) {
              const boardRowIndex = rowIndex / 2;
              const arrowColumnIndex = (columnIndex - 1) / 2;
              const arrowMidpoint = {
                rowIndex: boardRowIndex,
                columnIndex: arrowColumnIndex + 0.5,
              };
              const arrowKey = `${boardRowIndex}-${arrowColumnIndex}`;
              const arrowDirection = level.horizontalArrows[arrowKey];
              const hasArrowError = brokenArrowKeys.has(`h-${arrowKey}`);
              const previousNewGameArrowDirection =
                newGameAnimationSnapshot
                  ? newGameAnimationSnapshot.level.horizontalArrows[arrowKey]
                  : arrowDirection;
              const previousNewGameHasArrowError =
                newGameAnimationSnapshot?.validation.brokenArrowKeys.has(
                  `h-${arrowKey}`
                ) ?? hasArrowError;
              const newGameArrowAnimation =
                newGameTailFlipAnimation.getTailAnimation(
                  {
                    rowIndex: boardRowIndex,
                    columnIndex: arrowColumnIndex + 1,
                  },
                  newGameAnimationRunId
                );
              const resetAnimation = resetTailRiseAnimation.getTailAnimation(
                arrowMidpoint,
                resetAnimationRunId
              );

              return (
                <Arrow
                  key={key}
                  orientation="horizontal"
                  direction={arrowDirection}
                  isInvalid={hasArrowError}
                  newGameAnimation={
                    newGameArrowAnimation
                      ? {
                          delayMs: newGameArrowAnimation.delayMs,
                          fromDirection: previousNewGameArrowDirection,
                          fromIsInvalid: previousNewGameHasArrowError,
                          runId: newGameArrowAnimation.runId,
                        }
                      : undefined
                  }
                  resetAnimation={resetAnimation}
                />
              );
            }

            if (isVerticalArrowSlot) {
              const arrowRowIndex = (rowIndex - 1) / 2;
              const boardColumnIndex = columnIndex / 2;
              const tailBelow = {
                rowIndex: arrowRowIndex + 1,
                columnIndex: boardColumnIndex,
              };
              const arrowKey = `${arrowRowIndex}-${boardColumnIndex}`;
              const arrowDirection = level.verticalArrows[arrowKey];
              const hasArrowError = brokenArrowKeys.has(`v-${arrowKey}`);
              const previousNewGameArrowDirection =
                newGameAnimationSnapshot
                  ? newGameAnimationSnapshot.level.verticalArrows[arrowKey]
                  : arrowDirection;
              const previousNewGameHasArrowError =
                newGameAnimationSnapshot?.validation.brokenArrowKeys.has(
                  `v-${arrowKey}`
                ) ?? hasArrowError;
              const newGameArrowAnimation =
                newGameTailFlipAnimation.getTailAnimation(
                  tailBelow,
                  newGameAnimationRunId
                );
              const resetAnimation = resetTailRiseAnimation.getTailAnimation(
                tailBelow,
                resetAnimationRunId
              );

              return (
                <Arrow
                  key={key}
                  orientation="vertical"
                  direction={arrowDirection}
                  isInvalid={hasArrowError}
                  newGameAnimation={
                    newGameArrowAnimation
                      ? {
                          delayMs: newGameArrowAnimation.delayMs,
                          fromDirection: previousNewGameArrowDirection,
                          fromIsInvalid: previousNewGameHasArrowError,
                          runId: newGameArrowAnimation.runId,
                        }
                      : undefined
                  }
                  resetAnimation={resetAnimation}
                />
              );
            }

            return <div key={key} style={gapStyle} />;
          })
        )}
      </div>

      <div style={actionsStyle}>
        <ActionButton
          icon={newIconImage}
          variant="green"
          size={54}
          onClick={() => startNewLevel()}
        />
        <ActionButton
          icon={notesIconImage}
          pressing={isNotesModeSelected}
          size={54}
          variant={isNotesModeSelected ? "lightBlue" : "purple"}
          onClick={onToggleNotesMode}
        />
        <ActionButton
          icon={resetIconImage}
          variant="yellow"
          size={54}
          onClick={resetBoard}
        />
      </div>
    </section>
  );
}
