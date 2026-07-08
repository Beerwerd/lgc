import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { GameModule, GameRuntimeProps } from "../../platform/types";
import clearIconImage from "./assets/clear_icon.png";
import newIconImage from "./assets/new_icon.png";
import notesIconImage from "./assets/notes_icon.png";
import questionIconImage from "./assets/question_icon.png";
import resetIconImage from "./assets/reset_icon.png";
import coverImage from "./cover.png";
import { ActionButton } from "./components/ActionButton";
import { Arrow } from "./components/Arrow";
import { Button } from "./components/Button";
import { DifficultySelector } from "./components/DifficultySelector";
import { GameName } from "./components/GameName";
import { Tail } from "./components/Tail";
import "./futoshiki.css";
import {
  getCellKey,
  horizontalArrows,
  isGivenCell,
  NUMBER_OPTIONS,
  useFutoshikiGameState,
  verticalArrows,
} from "./logic";
import previewGif from "./preview.gif";

const boardRows = Array.from({ length: 9 }, (_, rowIndex) =>
  Array.from({ length: 9 }, (_, columnIndex) => ({
    key: `${rowIndex}-${columnIndex}`,
    rowIndex,
    columnIndex,
  }))
);

function FutoshikiGame({ resources }: GameRuntimeProps) {
  const {
    boardValues,
    selectedCell,
    validation,
    isLevelComplete,
    selectCell,
    selectNumber,
    clearSelectedCell,
    resetLevel,
  } = useFutoshikiGameState();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isHelpModalClosing, setIsHelpModalClosing] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  const openHelpModal = () => {
    setIsHelpModalClosing(false);
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalClosing(true);
  };

  const resetBoard = () => {
    resetLevel();
  };

  const startNewLevel = () => {
    resetLevel();
    setIsCompletionModalOpen(false);
  };

  const { duplicateCellKeys, brokenArrowKeys } = validation;

  useEffect(() => {
    if (isLevelComplete) {
      setIsCompletionModalOpen(true);
    }
  }, [isLevelComplete]);

  const startNextLevel = () => {
    resetLevel();
    setIsCompletionModalOpen(false);
  };

  return (
    <div
      className="futoshiki-game"
      onPointerDown={() =>
        resources.emit({
          type: "futoshiki.layout.press",
          payload: {
            mocked: true,
          },
        })
      }
    >
      <section className="futoshiki-block futoshiki-title-block">
        <div className="futoshiki-title-logo-row">
          <GameName />
        </div>
      </section>

      <div className="futoshiki-spacer" />

      <section className="futoshiki-block futoshiki-board-block">
        <div className="futoshiki-game-controls-row">
          <ActionButton
            icon={questionIconImage}
            variant="blue"
            onClick={openHelpModal}
          />
          <DifficultySelector />
        </div>
        <div className="futoshiki-board-mock">
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
                const isGiven = isGivenCell(cell);
                const hasDuplicateError = duplicateCellKeys.has(
                  getCellKey(cell)
                );
                const isSelected =
                  selectedCell?.rowIndex === boardRowIndex &&
                  selectedCell.columnIndex === boardColumnIndex;

                return (
                  <Tail
                    key={key}
                    variant="board"
                    value={value}
                    isGiven={isGiven}
                    isSelected={isSelected}
                    isInvalid={hasDuplicateError}
                    onClick={() => selectCell(cell)}
                  />
                );
              }

              if (isHorizontalArrowSlot) {
                const boardRowIndex = rowIndex / 2;
                const arrowColumnIndex = (columnIndex - 1) / 2;
                const arrowKey = `${boardRowIndex}-${arrowColumnIndex}`;
                const arrowDirection = horizontalArrows[arrowKey];
                const hasArrowError = brokenArrowKeys.has(`h-${arrowKey}`);

                return (
                  <Arrow
                    key={key}
                    orientation="horizontal"
                    direction={arrowDirection}
                    isInvalid={hasArrowError}
                  />
                );
              }

              if (isVerticalArrowSlot) {
                const arrowRowIndex = (rowIndex - 1) / 2;
                const boardColumnIndex = columnIndex / 2;
                const arrowKey = `${arrowRowIndex}-${boardColumnIndex}`;
                const arrowDirection = verticalArrows[arrowKey];
                const hasArrowError = brokenArrowKeys.has(`v-${arrowKey}`);

                return (
                  <Arrow
                    key={key}
                    orientation="vertical"
                    direction={arrowDirection}
                    isInvalid={hasArrowError}
                  />
                );
              }

              return <div className="futoshiki-board-mock__gap" key={key} />;
            })
          )}
        </div>

        <div className="futoshiki-board-actions">
          <ActionButton
            icon={newIconImage}
            variant="green"
            onClick={startNewLevel}
          />
          <ActionButton icon={notesIconImage} variant="purple" />
          <ActionButton
            icon={resetIconImage}
            variant="yellow"
            onClick={resetBoard}
          />
        </div>
      </section>

      <div className="futoshiki-spacer" />

      <section className="futoshiki-block futoshiki-number-block">
        <div className="futoshiki-number-line">
          {NUMBER_OPTIONS.map((number) => (
            <Tail
              key={number}
              variant="number"
              value={number}
              onClick={() => selectNumber(number)}
            />
          ))}
          <ActionButton
            className="futoshiki-number-line__clear"
            icon={clearIconImage}
            variant="red"
            fullWidth
            onClick={clearSelectedCell}
          />
        </div>
      </section>

      {isHelpModalOpen && (
        <div
          className={`futoshiki-help-modal${
            isHelpModalClosing ? " is-closing" : ""
          }`}
          onAnimationEnd={(event) => {
            if (event.currentTarget === event.target && isHelpModalClosing) {
              setIsHelpModalOpen(false);
              setIsHelpModalClosing(false);
            }
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
            if (event.currentTarget === event.target) {
              closeHelpModal();
            }
          }}
        >
          <section
            className="futoshiki-help-modal__dialog"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              className="futoshiki-help-modal__close"
              type="button"
              onClick={closeHelpModal}
            >
              <X size={22} />
            </button>

            <h4>How to play</h4>
            <p>
              Every row and column must contain each number from 1 to 5 exactly
              once. The small end of every inequality sign must hold the smaller
              value.
            </p>
          </section>
        </div>
      )}

      {isCompletionModalOpen && (
        <div
          className="futoshiki-help-modal futoshiki-complete-modal"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <section
            className="futoshiki-help-modal__dialog futoshiki-complete-modal__dialog"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <h4>Completed!</h4>
            <Button variant="green" onClick={startNextLevel}>
              Next
            </Button>
          </section>
        </div>
      )}
    </div>
  );
}

const futoshikiGame: GameModule = {
  name: "Futoshiki",
  catalog: {
    coverImage,
    previewGif,
    accent: "#43b996",
    size: 2,
  },
  Game: FutoshikiGame,
};

export default futoshikiGame;
