import { useMemo, useState } from 'react';

export type BoardValue = number | null;
export type BoardValues = BoardValue[][];
export type ArrowDirection = 'left' | 'right' | 'up' | 'down';

export type BoardCell = {
  rowIndex: number;
  columnIndex: number;
};

export type ValidationResult = {
  duplicateCellKeys: Set<string>;
  brokenArrowKeys: Set<string>;
};

export const BOARD_SIZE = 5;
export const NUMBER_OPTIONS = [1, 2, 3, 4, 5];

const initialBoardValues: BoardValues = [
  [4, null, 5, 3, null],
  [2, null, null, null, null],
  [null, null, null, null, null],
  [1, null, 2, null, null],
  [3, 1, null, 2, 5],
];

export const horizontalArrows: Record<string, Extract<ArrowDirection, 'left' | 'right'>> = {
  '0-0': 'right',
  '0-2': 'right',
  '0-3': 'right',
  '1-0': 'left',
  '2-0': 'right',
  '2-3': 'right',
  '3-0': 'left',
  '3-1': 'right',
  '4-3': 'left',
};

export const verticalArrows: Record<string, Extract<ArrowDirection, 'up' | 'down'>> = {
  '0-0': 'down',
  '0-1': 'up',
  '0-3': 'down',
  '1-1': 'down',
  '1-2': 'down',
  '1-4': 'down',
  '2-2': 'up',
  '2-3': 'up',
  '3-3': 'down',
};

export const getCellKey = ({ rowIndex, columnIndex }: BoardCell) => `${rowIndex}-${columnIndex}`;

export function createInitialBoardValues() {
  return initialBoardValues.map((row) => [...row]);
}

export function isGivenCell({ rowIndex, columnIndex }: BoardCell) {
  return initialBoardValues[rowIndex][columnIndex] !== null;
}

export function setBoardCellValue(boardValues: BoardValues, selectedCell: BoardCell, number: number) {
  if (isGivenCell(selectedCell)) {
    return boardValues;
  }

  return boardValues.map((row, rowIndex) =>
    row.map((value, columnIndex) => {
      if (rowIndex !== selectedCell.rowIndex || columnIndex !== selectedCell.columnIndex) {
        return value;
      }

      return value === number ? null : number;
    }),
  );
}

export function clearBoardCellValue(boardValues: BoardValues, selectedCell: BoardCell) {
  if (isGivenCell(selectedCell)) {
    return boardValues;
  }

  return boardValues.map((row, rowIndex) =>
    row.map((value, columnIndex) =>
      rowIndex === selectedCell.rowIndex && columnIndex === selectedCell.columnIndex ? null : value,
    ),
  );
}

export function validateBoard(boardValues: BoardValues): ValidationResult {
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
      })),
    );
    markDuplicates(
      Array.from({ length: BOARD_SIZE }, (_, rowIndex) => ({
        rowIndex,
        columnIndex: index,
      })),
    );
  }

  Object.entries(horizontalArrows).forEach(([arrowKey, direction]) => {
    const [rowIndex, columnIndex] = arrowKey.split('-').map(Number);
    const leftValue = boardValues[rowIndex][columnIndex];
    const rightValue = boardValues[rowIndex][columnIndex + 1];

    if (!leftValue || !rightValue) {
      return;
    }

    const isValid = direction === 'left' ? leftValue < rightValue : leftValue > rightValue;

    if (!isValid) {
      brokenArrowKeys.add(`h-${arrowKey}`);
    }
  });

  Object.entries(verticalArrows).forEach(([arrowKey, direction]) => {
    const [rowIndex, columnIndex] = arrowKey.split('-').map(Number);
    const topValue = boardValues[rowIndex][columnIndex];
    const bottomValue = boardValues[rowIndex + 1][columnIndex];

    if (!topValue || !bottomValue) {
      return;
    }

    const isValid = direction === 'up' ? topValue < bottomValue : topValue > bottomValue;

    if (!isValid) {
      brokenArrowKeys.add(`v-${arrowKey}`);
    }
  });

  return {
    duplicateCellKeys,
    brokenArrowKeys,
  };
}

export function isBoardComplete(boardValues: BoardValues, validation: ValidationResult) {
  return (
    boardValues.every((row) => row.every((value) => value !== null)) &&
    validation.duplicateCellKeys.size === 0 &&
    validation.brokenArrowKeys.size === 0
  );
}

export function useFutoshikiGameState() {
  const [boardValues, setBoardValues] = useState(createInitialBoardValues);
  const [selectedCell, setSelectedCell] = useState<BoardCell | null>(null);
  const validation = useMemo(() => validateBoard(boardValues), [boardValues]);
  const isLevelComplete = isBoardComplete(boardValues, validation);

  const selectCell = (cell: BoardCell) => {
    if (!isGivenCell(cell)) {
      setSelectedCell(cell);
    }
  };

  const selectNumber = (number: number) => {
    if (!selectedCell || isGivenCell(selectedCell)) {
      return;
    }

    setBoardValues((currentBoardValues) =>
      setBoardCellValue(currentBoardValues, selectedCell, number),
    );
  };

  const clearSelectedCell = () => {
    if (!selectedCell || isGivenCell(selectedCell)) {
      return;
    }

    setBoardValues((currentBoardValues) =>
      clearBoardCellValue(currentBoardValues, selectedCell),
    );
  };

  const resetLevel = () => {
    setBoardValues(createInitialBoardValues());
    setSelectedCell(null);
  };

  return {
    boardValues,
    selectedCell,
    validation,
    isLevelComplete,
    selectCell,
    selectNumber,
    clearSelectedCell,
    resetLevel,
  };
}
