export type Difficulty = "easy" | "hard";
export type BoardValue = number | null;
export type BoardValues = BoardValue[][];
export type BoardNotes = number[][][];
export type ArrowDirection = "left" | "right" | "up" | "down";

export type BoardCell = {
  rowIndex: number;
  columnIndex: number;
};

export type HorizontalArrowDirection = Extract<ArrowDirection, "left" | "right">;
export type VerticalArrowDirection = Extract<ArrowDirection, "up" | "down">;
export type HorizontalArrows = Record<string, HorizontalArrowDirection>;
export type VerticalArrows = Record<string, VerticalArrowDirection>;

export type FutoshikiLevel = {
  difficulty: Difficulty;
  givens: BoardValues;
  horizontalArrows: HorizontalArrows;
  solution: number[][];
  verticalArrows: VerticalArrows;
};

type GeneratorConfig = {
  arrowCount: number;
  maxAttempts: number;
  targetGivenCount: number;
};

type ArrowCandidate =
  | {
      direction: HorizontalArrowDirection;
      key: string;
      orientation: "horizontal";
    }
  | {
      direction: VerticalArrowDirection;
      key: string;
      orientation: "vertical";
    };

export const BOARD_SIZE = 5;
export const NUMBER_OPTIONS = [1, 2, 3, 4, 5];

const generatorConfigs: Record<Difficulty, GeneratorConfig> = {
  easy: {
    arrowCount: 14,
    maxAttempts: 40,
    targetGivenCount: 11,
  },
  hard: {
    arrowCount: 9,
    maxAttempts: 80,
    targetGivenCount: 7,
  },
};

function shuffle<TValue>(values: TValue[]) {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function cloneBoardValues(boardValues: BoardValues): BoardValues {
  return boardValues.map((row) => [...row]);
}

function createRandomSolution() {
  const rowOrder = shuffle(NUMBER_OPTIONS.map((number) => number - 1));
  const columnOrder = shuffle(NUMBER_OPTIONS.map((number) => number - 1));
  const numberMap = shuffle(NUMBER_OPTIONS);

  return rowOrder.map((rowIndex) =>
    columnOrder.map((columnIndex) => {
      const baseValueIndex = (rowIndex + columnIndex) % BOARD_SIZE;

      return numberMap[baseValueIndex];
    })
  );
}

function createArrowCandidates(solution: number[][]): ArrowCandidate[] {
  const candidates: ArrowCandidate[] = [];

  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < BOARD_SIZE - 1; columnIndex += 1) {
      candidates.push({
        direction:
          solution[rowIndex][columnIndex] < solution[rowIndex][columnIndex + 1]
            ? "left"
            : "right",
        key: `${rowIndex}-${columnIndex}`,
        orientation: "horizontal",
      });
    }
  }

  for (let rowIndex = 0; rowIndex < BOARD_SIZE - 1; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < BOARD_SIZE; columnIndex += 1) {
      candidates.push({
        direction:
          solution[rowIndex][columnIndex] < solution[rowIndex + 1][columnIndex]
            ? "up"
            : "down",
        key: `${rowIndex}-${columnIndex}`,
        orientation: "vertical",
      });
    }
  }

  return shuffle(candidates);
}

function createArrows(solution: number[][], arrowCount: number) {
  const horizontalArrows: HorizontalArrows = {};
  const verticalArrows: VerticalArrows = {};

  createArrowCandidates(solution)
    .slice(0, arrowCount)
    .forEach((arrow) => {
      if (arrow.orientation === "horizontal") {
        horizontalArrows[arrow.key] = arrow.direction;
        return;
      }

      verticalArrows[arrow.key] = arrow.direction;
    });

  return {
    horizontalArrows,
    verticalArrows,
  };
}

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

function isCandidateValidAgainstArrows(
  boardValues: BoardValues,
  horizontalArrows: HorizontalArrows,
  verticalArrows: VerticalArrows,
  cell: BoardCell,
  value: number
) {
  const { rowIndex, columnIndex } = cell;
  const leftDirection = horizontalArrows[`${rowIndex}-${columnIndex - 1}`];
  const rightDirection = horizontalArrows[`${rowIndex}-${columnIndex}`];
  const topDirection = verticalArrows[`${rowIndex - 1}-${columnIndex}`];
  const bottomDirection = verticalArrows[`${rowIndex}-${columnIndex}`];

  if (leftDirection) {
    const leftValue = boardValues[rowIndex][columnIndex - 1];

    if (
      leftValue !== null &&
      !isHorizontalPairValid(leftValue, value, leftDirection)
    ) {
      return false;
    }
  }

  if (rightDirection) {
    const rightValue = boardValues[rowIndex][columnIndex + 1];

    if (
      rightValue !== null &&
      !isHorizontalPairValid(value, rightValue, rightDirection)
    ) {
      return false;
    }
  }

  if (topDirection) {
    const topValue = boardValues[rowIndex - 1][columnIndex];

    if (
      topValue !== null &&
      !isVerticalPairValid(topValue, value, topDirection)
    ) {
      return false;
    }
  }

  if (bottomDirection) {
    const bottomValue = boardValues[rowIndex + 1][columnIndex];

    if (
      bottomValue !== null &&
      !isVerticalPairValid(value, bottomValue, bottomDirection)
    ) {
      return false;
    }
  }

  return true;
}

function countSolutions(
  givens: BoardValues,
  horizontalArrows: HorizontalArrows,
  verticalArrows: VerticalArrows,
  maxSolutions: number
) {
  const boardValues = cloneBoardValues(givens);
  const rowMasks = Array.from({ length: BOARD_SIZE }, () => 0);
  const columnMasks = Array.from({ length: BOARD_SIZE }, () => 0);

  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < BOARD_SIZE; columnIndex += 1) {
      const value = boardValues[rowIndex][columnIndex];

      if (value === null) {
        continue;
      }

      const bit = 1 << value;

      if (
        (rowMasks[rowIndex] & bit) !== 0 ||
        (columnMasks[columnIndex] & bit) !== 0
      ) {
        return 0;
      }

      if (
        !isCandidateValidAgainstArrows(
          boardValues,
          horizontalArrows,
          verticalArrows,
          { rowIndex, columnIndex },
          value
        )
      ) {
        return 0;
      }

      rowMasks[rowIndex] |= bit;
      columnMasks[columnIndex] |= bit;
    }
  }

  let solutions = 0;

  const getCandidates = (cell: BoardCell) =>
    NUMBER_OPTIONS.filter((value) => {
      const bit = 1 << value;

      return (
        (rowMasks[cell.rowIndex] & bit) === 0 &&
        (columnMasks[cell.columnIndex] & bit) === 0 &&
        isCandidateValidAgainstArrows(
          boardValues,
          horizontalArrows,
          verticalArrows,
          cell,
          value
        )
      );
    });

  const findNextCell = () => {
    let nextCell: BoardCell | null = null;
    let nextCandidates: number[] = [];

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < BOARD_SIZE; columnIndex += 1) {
        if (boardValues[rowIndex][columnIndex] !== null) {
          continue;
        }

        const candidates = getCandidates({ rowIndex, columnIndex });

        if (candidates.length === 0) {
          return {
            candidates,
            cell: { rowIndex, columnIndex },
          };
        }

        if (nextCell === null || candidates.length < nextCandidates.length) {
          nextCell = { rowIndex, columnIndex };
          nextCandidates = candidates;
        }
      }
    }

    return nextCell ? { candidates: nextCandidates, cell: nextCell } : null;
  };

  const backtrack = () => {
    if (solutions >= maxSolutions) {
      return;
    }

    const next = findNextCell();

    if (next === null) {
      solutions += 1;
      return;
    }

    if (next.candidates.length === 0) {
      return;
    }

    shuffle(next.candidates).forEach((value) => {
      if (solutions >= maxSolutions) {
        return;
      }

      const bit = 1 << value;
      boardValues[next.cell.rowIndex][next.cell.columnIndex] = value;
      rowMasks[next.cell.rowIndex] |= bit;
      columnMasks[next.cell.columnIndex] |= bit;

      backtrack();

      boardValues[next.cell.rowIndex][next.cell.columnIndex] = null;
      rowMasks[next.cell.rowIndex] &= ~bit;
      columnMasks[next.cell.columnIndex] &= ~bit;
    });
  };

  backtrack();

  return solutions;
}

function getGivenCount(givens: BoardValues) {
  return givens.reduce(
    (total, row) =>
      total + row.filter((value): value is number => value !== null).length,
    0
  );
}

function createUniqueGivens(
  solution: number[][],
  horizontalArrows: HorizontalArrows,
  verticalArrows: VerticalArrows,
  targetGivenCount: number
) {
  const givens: BoardValues = solution.map((row) => [...row]);
  const removableCells = shuffle(
    Array.from({ length: BOARD_SIZE }, (_, rowIndex) =>
      Array.from({ length: BOARD_SIZE }, (_, columnIndex) => ({
        rowIndex,
        columnIndex,
      }))
    ).flat()
  );

  removableCells.forEach((cell) => {
    if (getGivenCount(givens) <= targetGivenCount) {
      return;
    }

    const currentValue = givens[cell.rowIndex][cell.columnIndex];
    givens[cell.rowIndex][cell.columnIndex] = null;

    if (countSolutions(givens, horizontalArrows, verticalArrows, 2) !== 1) {
      givens[cell.rowIndex][cell.columnIndex] = currentValue;
    }
  });

  return givens;
}

function createFallbackLevel(difficulty: Difficulty): FutoshikiLevel {
  const solution = [
    [4, 2, 5, 3, 1],
    [2, 5, 3, 1, 4],
    [5, 3, 1, 4, 2],
    [1, 4, 2, 5, 3],
    [3, 1, 4, 2, 5],
  ];
  const horizontalArrows: HorizontalArrows = {
    "0-0": "right",
    "0-2": "right",
    "0-3": "right",
    "1-0": "left",
    "2-0": "right",
    "2-3": "right",
    "3-0": "left",
    "3-1": "right",
    "4-3": "left",
  };
  const verticalArrows: VerticalArrows = {
    "0-0": "down",
    "0-1": "up",
    "0-3": "down",
    "1-1": "down",
    "1-2": "down",
    "1-4": "down",
    "2-2": "up",
    "2-3": "up",
    "3-3": "down",
  };

  return {
    difficulty,
    givens: [
      [4, null, 5, 3, null],
      [2, null, null, null, null],
      [null, null, null, null, null],
      [1, null, 2, null, null],
      [3, 1, null, 2, 5],
    ],
    horizontalArrows,
    solution,
    verticalArrows,
  };
}

export function generateFutoshikiLevel(difficulty: Difficulty): FutoshikiLevel {
  const config = generatorConfigs[difficulty];
  let bestLevel: FutoshikiLevel | null = null;

  for (let attempt = 0; attempt < config.maxAttempts; attempt += 1) {
    const solution = createRandomSolution();
    const { horizontalArrows, verticalArrows } = createArrows(
      solution,
      config.arrowCount
    );
    const givens = createUniqueGivens(
      solution,
      horizontalArrows,
      verticalArrows,
      config.targetGivenCount
    );
    const level = {
      difficulty,
      givens,
      horizontalArrows,
      solution,
      verticalArrows,
    };

    if (
      bestLevel === null ||
      getGivenCount(level.givens) < getGivenCount(bestLevel.givens)
    ) {
      bestLevel = level;
    }

    if (getGivenCount(givens) <= config.targetGivenCount) {
      return level;
    }
  }

  return bestLevel ?? createFallbackLevel(difficulty);
}

export function isGivenCell(level: FutoshikiLevel, cell: BoardCell) {
  return level.givens[cell.rowIndex][cell.columnIndex] !== null;
}

export function createInitialBoardValues(level: FutoshikiLevel) {
  return cloneBoardValues(level.givens);
}

export function createInitialBoardNotes(): BoardNotes {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => [])
  );
}
