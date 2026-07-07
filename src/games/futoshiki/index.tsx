import { useCallback } from 'react';
import type { GameModule, GameRuntimeProps } from '../../platform/types';
import {
  drawFittedText,
  fillRoundedRect,
  strokeRoundedRect,
  useCanvasRenderer,
} from '../../platform/canvas';
import './futoshiki.css';

const boardValues = [
  [3, 0, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 3],
  [0, 4, 0, 0],
];

const inequalities = [
  { row: 0, column: 0, sign: '>' },
  { row: 0, column: 2, sign: '>' },
  { row: 1, column: 0, sign: '<' },
  { row: 2, column: 1, sign: '<' },
  { row: 3, column: 2, sign: '<' },
];

function paintFutoshikiBoard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
) {
  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#19323a');
  background.addColorStop(1, '#10181f');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const boardSize = Math.min(width, height) * 0.72;
  const boardX = (width - boardSize) / 2;
  const boardY = (height - boardSize) / 2 + Math.sin(phase * 1.4) * 5;
  const cellGap = boardSize * 0.035;
  const cellSize = (boardSize - cellGap * 3) / 4;

  fillRoundedRect(
    ctx,
    {
      x: boardX - cellGap,
      y: boardY - cellGap,
      width: boardSize + cellGap * 2,
      height: boardSize + cellGap * 2,
    },
    12,
    'rgba(245, 247, 242, 0.08)',
  );

  boardValues.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const x = boardX + columnIndex * (cellSize + cellGap);
      const y = boardY + rowIndex * (cellSize + cellGap);
      const isGiven = value > 0;

      fillRoundedRect(
        ctx,
        { x, y, width: cellSize, height: cellSize },
        8,
        isGiven ? '#43b996' : 'rgba(245, 247, 242, 0.1)',
      );
      strokeRoundedRect(
        ctx,
        { x, y, width: cellSize, height: cellSize },
        8,
        'rgba(245, 247, 242, 0.22)',
        2,
      );

      if (value) {
        drawFittedText(
          ctx,
          String(value),
          x + cellSize / 2,
          y + cellSize / 2,
          cellSize * 0.65,
          34,
          16,
          { color: '#10181f' },
        );
      }
    });
  });

  inequalities.forEach(({ row, column, sign }) => {
    const x = boardX + column * (cellSize + cellGap) + cellSize + cellGap / 2;
    const y = boardY + row * (cellSize + cellGap) + cellSize / 2;

    drawFittedText(ctx, sign, x, y, cellGap * 1.8, 22, 10, {
      color: '#f0cc72',
    });
  });

  drawFittedText(
    ctx,
    'Futoshiki canvas mock',
    width / 2,
    Math.max(28, height * 0.09),
    width * 0.76,
    30,
    14,
  );
}

function FutoshikiGame({ resources }: GameRuntimeProps) {
  const canvasRef = useCanvasRenderer(paintFutoshikiBoard, {
    animated: true,
    blockPageGestures: true,
  });

  const emitCanvasPress = useCallback(
    () =>
      resources.emit({
        type: 'futoshiki.canvas.press',
        payload: {
          mocked: true,
        },
      }),
    [resources],
  );

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas futoshiki-game-canvas"
      aria-label="Futoshiki canvas mock game"
      onPointerDown={emitCanvasPress}
    />
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
