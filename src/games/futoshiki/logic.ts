import { useMemo, useState } from "react";
import {
  BOARD_SIZE,
  NUMBER_OPTIONS,
  createInitialBoardNotes,
  createInitialBoardValues,
  generateFutoshikiLevel,
  isGivenCell,
  type BoardCell,
  type BoardNotes,
  type BoardValues,
  type Difficulty,
  type FutoshikiLevel,
  type HorizontalArrowDirection,
  type VerticalArrowDirection,
} from "./generator";

export {
  BOARD_SIZE,
  NUMBER_OPTIONS,
  createInitialBoardNotes,
  createInitialBoardValues,
  generateFutoshikiLevel,
  isGivenCell,
};
export type {
  ArrowDirection,
  BoardCell,
  BoardNotes,
  BoardValue,
  BoardValues,
  Difficulty,
  FutoshikiLevel,
  HorizontalArrows,
  VerticalArrows,
} from "./generator";

export type ValidationResult = {
  brokenArrowKeys: Set<string>;
  duplicateCellKeys: Set<string>;
};

export const getCellKey = ({ rowIndex, columnIndex }: BoardCell) =>
  `${rowIndex}-${columnIndex}`;

function isHorizontalPairValid(
  leftValue: number,
  rightValue: number,
  direction: HorizontalArrowDirection
) {
  return direction === "left"
    ? leftValue < rightValue
    : leftValue > rightValue;
}

function isVerticalPairValid(
  topValue: number,
  bottomValue: number,
  direction: VerticalArrowDirection
) {
  return direction === "up" ? topValue < bottomValue : topValue > bottomValue;
}

export function setBoardCellValue(
  level: FutoshikiLevel,
  boardValues: BoardValues,
  selectedCell: BoardCell,
  number: number
) {
  if (isGivenCell(level, selectedCell)) {
    return boardValues;
  }

  return boardValues.map((row, rowIndex) =>
    row.map((value, columnIndex) => {
      if (
        rowIndex !== selectedCell.rowIndex ||
        columnIndex !== selectedCell.columnIndex
      ) {
        return value;
      }

      return value === number ? null : number;
    })
  );
}

export function clearBoardCellValue(
  level: FutoshikiLevel,
  boardValues: BoardValues,
  selectedCell: BoardCell
) {
  if (isGivenCell(level, selectedCell)) {
    return boardValues;
  }

  return boardValues.map((row, rowIndex) =>
    row.map((value, columnIndex) =>
      rowIndex === selectedCell.rowIndex &&
      columnIndex === selectedCell.columnIndex
        ? null
        : value
    )
  );
}

export function clearBoardCellNotes(
  boardNotes: BoardNotes,
  selectedCell: BoardCell
) {
  return boardNotes.map((row, rowIndex) =>
    row.map((notes, columnIndex) =>
      rowIndex === selectedCell.rowIndex &&
      columnIndex === selectedCell.columnIndex
        ? []
        : notes
    )
  );
}

export function toggleBoardCellNote(
  level: FutoshikiLevel,
  boardNotes: BoardNotes,
  boardValues: BoardValues,
  selectedCell: BoardCell,
  number: number
) {
  if (
    isGivenCell(level, selectedCell) ||
    boardValues[selectedCell.rowIndex][selectedCell.columnIndex]
  ) {
    return clearBoardCellNotes(boardNotes, selectedCell);
  }

  return boardNotes.map((row, rowIndex) =>
    row.map((notes, columnIndex) => {
      if (
        rowIndex !== selectedCell.rowIndex ||
        columnIndex !== selectedCell.columnIndex
      ) {
        return notes;
      }

      if (notes.includes(number)) {
        return notes.filter((note) => note !== number);
      }

      return [...notes, number].sort((left, right) => left - right);
    })
  );
}

export function validateBoard(
  boardValues: BoardValues,
  level: FutoshikiLevel
): ValidationResult {
  const duplicateCellKeys = new Set<string>();
  const brokenArrowKeys = new Set<string>();

  const markDuplicates = (cells: BoardCell[]) => {
    const valuesToCells = new Map<number, BoardCell[]>();

    cells.forEach((cell) => {
      const value = boardValues[cell.rowIndex][cell.columnIndex];

      if (!value) {
        return;
      }

      valuesToCells.set(value, [...(valuesToCells.get(value) ?? []), cell]);
    });

    valuesToCells.forEach((matchingCells) => {
      if (matchingCells.length > 1) {
        matchingCells.forEach((cell) => duplicateCellKeys.add(getCellKey(cell)));
      }
    });
  };

  for (let index = 0; index < BOARD_SIZE; index += 1) {
    markDuplicates(
      Array.from({ length: BOARD_SIZE }, (_, columnIndex) => ({
        rowIndex: index,
        columnIndex,
      }))
    );
    markDuplicates(
      Array.from({ length: BOARD_SIZE }, (_, rowIndex) => ({
        rowIndex,
        columnIndex: index,
      }))
    );
  }

  Object.entries(level.horizontalArrows).forEach(([arrowKey, direction]) => {
    const [rowIndex, columnIndex] = arrowKey.split("-").map(Number);
    const leftValue = boardValues[rowIndex][columnIndex];
    const rightValue = boardValues[rowIndex][columnIndex + 1];

    if (!leftValue || !rightValue) {
      return;
    }

    if (!isHorizontalPairValid(leftValue, rightValue, direction)) {
      brokenArrowKeys.add(`h-${arrowKey}`);
    }
  });

  Object.entries(level.verticalArrows).forEach(([arrowKey, direction]) => {
    const [rowIndex, columnIndex] = arrowKey.split("-").map(Number);
    const topValue = boardValues[rowIndex][columnIndex];
    const bottomValue = boardValues[rowIndex + 1][columnIndex];

    if (!topValue || !bottomValue) {
      return;
    }

    if (!isVerticalPairValid(topValue, bottomValue, direction)) {
      brokenArrowKeys.add(`v-${arrowKey}`);
    }
  });

  return {
    brokenArrowKeys,
    duplicateCellKeys,
  };
}

export function isBoardComplete(
  boardValues: BoardValues,
  validation: ValidationResult
) {
  return (
    boardValues.every((row) => row.every((value) => value !== null)) &&
    validation.duplicateCellKeys.size === 0 &&
    validation.brokenArrowKeys.size === 0
  );
}

export function useFutoshikiGameState() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [level, setLevel] = useState(() => generateFutoshikiLevel("easy"));
  const [boardValues, setBoardValues] = useState(() =>
    createInitialBoardValues(level)
  );
  const [boardNotes, setBoardNotes] = useState(createInitialBoardNotes);
  const [selectedCell, setSelectedCell] = useState<BoardCell | null>(null);
  const validation = useMemo(
    () => validateBoard(boardValues, level),
    [boardValues, level]
  );
  const isLevelComplete = isBoardComplete(boardValues, validation);

  const resetLevel = () => {
    setBoardValues(createInitialBoardValues(level));
    setBoardNotes(createInitialBoardNotes());
    setSelectedCell(null);
  };

  const startNewLevel = (nextDifficulty = difficulty) => {
    const nextLevel = generateFutoshikiLevel(nextDifficulty);

    setDifficulty(nextDifficulty);
    setLevel(nextLevel);
    setBoardValues(createInitialBoardValues(nextLevel));
    setBoardNotes(createInitialBoardNotes());
    setSelectedCell(null);
  };

  const selectCell = (cell: BoardCell) => {
    if (!isGivenCell(level, cell)) {
      setSelectedCell(cell);
    }
  };

  const selectNumber = (number: number) => {
    if (!selectedCell || isGivenCell(level, selectedCell)) {
      return;
    }

    setBoardValues((currentBoardValues) =>
      setBoardCellValue(level, currentBoardValues, selectedCell, number)
    );
    setBoardNotes((currentBoardNotes) =>
      clearBoardCellNotes(currentBoardNotes, selectedCell)
    );
  };

  const toggleSelectedNote = (number: number) => {
    if (!selectedCell || isGivenCell(level, selectedCell)) {
      return;
    }

    setBoardNotes((currentBoardNotes) =>
      toggleBoardCellNote(
        level,
        currentBoardNotes,
        boardValues,
        selectedCell,
        number
      )
    );
  };

  const clearSelectedCell = () => {
    if (!selectedCell || isGivenCell(level, selectedCell)) {
      return;
    }

    setBoardValues((currentBoardValues) =>
      clearBoardCellValue(level, currentBoardValues, selectedCell)
    );
    setBoardNotes((currentBoardNotes) =>
      clearBoardCellNotes(currentBoardNotes, selectedCell)
    );
  };

  return {
    boardNotes,
    boardValues,
    clearSelectedCell,
    difficulty,
    isLevelComplete,
    level,
    resetLevel,
    selectCell,
    selectNumber,
    selectedCell,
    startNewLevel,
    toggleSelectedNote,
    validation,
  };
}
