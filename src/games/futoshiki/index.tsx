import { useEffect, useState } from "react";
import type { GameModule, GameRuntimeProps } from "../../platform/types";
import clearIconImage from "./assets/clear_icon.png";
import coverImage from "./cover.png";
import { ActionButton } from "./components/ActionButton";
import { Button } from "./components/Button";
import { GameArea } from "./components/GameArea";
import { GameName } from "./components/GameName";
import { HowToPlayDialog } from "./components/HowToPlayDialog";
import { Tail } from "./components/Tail";
import "./futoshiki.css";
import {
  NUMBER_OPTIONS,
  useFutoshikiGameState,
  type Difficulty,
} from "./logic";
import previewGif from "./preview.gif";

function FutoshikiGame({ resources }: GameRuntimeProps) {
  const {
    boardValues,
    difficulty,
    boardNotes,
    level,
    selectedCell,
    validation,
    isLevelComplete,
    selectCell,
    selectNumber,
    toggleSelectedNote,
    clearSelectedCell,
    resetLevel,
    startNewLevel: generateNewLevel,
  } = useFutoshikiGameState();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isHelpModalClosing, setIsHelpModalClosing] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isNotesModeSelected, setIsNotesModeSelected] = useState(false);

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

  const startNewLevel = (nextDifficulty?: Difficulty) => {
    generateNewLevel(nextDifficulty);
    setIsCompletionModalOpen(false);
  };

  const toggleNotesMode = () => {
    setIsNotesModeSelected((isSelected) => !isSelected);
  };

  const handleNumberSelect = (number: number) => {
    if (isNotesModeSelected) {
      toggleSelectedNote(number);
      return;
    }

    selectNumber(number);
  };

  useEffect(() => {
    if (isLevelComplete) {
      setIsCompletionModalOpen(true);
    }
  }, [isLevelComplete]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement &&
          event.target.isContentEditable) ||
        isHelpModalOpen ||
        isCompletionModalOpen
      ) {
        return;
      }

      if (event.key >= "1" && event.key <= "5") {
        event.preventDefault();
        handleNumberSelect(Number(event.key));
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        clearSelectedCell();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    clearSelectedCell,
    handleNumberSelect,
    isCompletionModalOpen,
    isHelpModalOpen,
  ]);

  const startNextLevel = () => {
    generateNewLevel();
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

      <GameArea
        boardValues={boardValues}
        boardNotes={boardNotes}
        selectedCell={selectedCell}
        validation={validation}
        difficulty={difficulty}
        isNotesModeSelected={isNotesModeSelected}
        level={level}
        onOpenHelpModal={openHelpModal}
        onResetBoard={resetBoard}
        onSelectCell={selectCell}
        onStartNewLevel={startNewLevel}
        onToggleNotesMode={toggleNotesMode}
      />

      <div className="futoshiki-spacer" />

      <section className="futoshiki-block futoshiki-number-block">
        <div className="futoshiki-number-line">
          {NUMBER_OPTIONS.map((number) => (
            <Tail
              key={number}
              variant="number"
              value={number}
              onClick={() => handleNumberSelect(number)}
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
        <HowToPlayDialog
          isClosing={isHelpModalClosing}
          onClose={closeHelpModal}
          onClosed={() => {
            setIsHelpModalOpen(false);
            setIsHelpModalClosing(false);
          }}
        />
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
