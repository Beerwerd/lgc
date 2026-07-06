import { useState } from 'react';
import type { GameModule, GameRuntimeProps } from '../../platform/types';
import './futoshiki.css';

const size = 4;
const numberRange = [1, 2, 3, 4];
const givens = new Map([
  ['0:0', 3],
  ['1:2', 1],
  ['2:3', 3],
  ['3:1', 4],
]);

const horizontalConstraints = new Map([
  ['0:0', '>'],
  ['0:2', '>'],
  ['1:0', '<'],
  ['2:1', '<'],
  ['3:2', '<'],
]);

const verticalConstraints = new Map([
  ['0:1', '<'],
  ['0:3', '>'],
  ['1:0', '>'],
  ['2:2', '<'],
]);

const createInitialBoard = () =>
  Array.from({ length: size }, (_, rowIndex) =>
    Array.from({ length: size }, (_, columnIndex) => givens.get(`${rowIndex}:${columnIndex}`) ?? 0),
  );

function FutoshikiGame({ resources }: GameRuntimeProps) {
  const [board, setBoard] = useState(() =>
    resources.getPreference('board', createInitialBoard()),
  );

  const changeCell = (rowIndex: number, columnIndex: number) => {
    if (givens.has(`${rowIndex}:${columnIndex}`)) {
      return;
    }

    setBoard((currentBoard) => {
      const nextBoard = currentBoard.map((row) => [...row]);
      const currentValue = nextBoard[rowIndex][columnIndex];
      const nextValue = currentValue === numberRange.length ? 0 : currentValue + 1;

      nextBoard[rowIndex][columnIndex] = nextValue;
      resources.setPreference('board', nextBoard);
      resources.emit({
        type: 'futoshiki.cell.change',
        payload: {
          row: rowIndex,
          column: columnIndex,
          value: nextValue,
        },
      });

      return nextBoard;
    });
  };

  return (
    <div className="futoshiki-game">
      <div className="futoshiki-board" aria-label="Futoshiki board">
        {Array.from({ length: size * 2 - 1 }, (_, visualRow) =>
          Array.from({ length: size * 2 - 1 }, (_, visualColumn) => {
            const key = `${visualRow}:${visualColumn}`;

            if (visualRow % 2 === 0 && visualColumn % 2 === 0) {
              const rowIndex = visualRow / 2;
              const columnIndex = visualColumn / 2;
              const isGiven = givens.has(`${rowIndex}:${columnIndex}`);
              const value = board[rowIndex][columnIndex];

              return (
                <button
                  className={`futoshiki-cell${isGiven ? ' is-given' : ''}`}
                  type="button"
                  key={key}
                  onClick={() => changeCell(rowIndex, columnIndex)}
                  aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}`}
                >
                  {value || ''}
                </button>
              );
            }

            if (visualRow % 2 === 0) {
              const rowIndex = visualRow / 2;
              const columnIndex = (visualColumn - 1) / 2;
              const sign = horizontalConstraints.get(`${rowIndex}:${columnIndex}`);

              return (
                <span className="futoshiki-constraint" key={key} aria-hidden="true">
                  {sign}
                </span>
              );
            }

            if (visualColumn % 2 === 0) {
              const rowIndex = (visualRow - 1) / 2;
              const columnIndex = visualColumn / 2;
              const sign = verticalConstraints.get(`${rowIndex}:${columnIndex}`);

              return (
                <span className="futoshiki-constraint" key={key} aria-hidden="true">
                  {sign ? (sign === '<' ? 'v' : '^') : ''}
                </span>
              );
            }

            return <span className="futoshiki-spacer" key={key} aria-hidden="true" />;
          }),
        )}
      </div>
    </div>
  );
}

const futoshikiGame: GameModule = {
  name: 'Futoshiki',
  catalog: {
    coverImage: '/games/futoshiki-cover.png',
    previewGif: '/games/futoshiki-preview.gif',
    accent: '#43b996',
    size: 2,
  },
  Game: FutoshikiGame,
};

export default futoshikiGame;
