import { useCallback } from 'react';
import type { GameModule, GameRuntimeProps } from '../../platform/types';
import {
  drawFittedText,
  fillRoundedRect,
  strokeRoundedRect,
  useCanvasRenderer,
} from '../../platform/canvas';
import coverImage from './cover.png';
import previewGif from './preview.gif';
import './zebra.css';

const houseColors = ['#c75146', '#4d8fcf', '#43b996', '#f4e6bf', '#e0b84f'];
const houseLabels = ['Red', 'Tea', 'Fox', 'Milk', 'Zebra'];

function paintZebraScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
) {
  const sky = ctx.createLinearGradient(0, 0, width, height);
  sky.addColorStop(0, '#253845');
  sky.addColorStop(1, '#10181f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const groundHeight = Math.max(70, height * 0.2);
  ctx.fillStyle = '#1f332c';
  ctx.fillRect(0, height - groundHeight, width, groundHeight);

  const padding = Math.max(14, width * 0.035);
  const gap = Math.max(8, width * 0.012);
  const availableWidth = width - padding * 2 - gap * 4;
  const houseWidth = Math.max(34, availableWidth / 5);
  const houseHeight = Math.min(height * 0.52, houseWidth * 1.18);
  const baseY = height - groundHeight + 10;
  const bodyY = baseY - houseHeight;

  houseColors.forEach((color, index) => {
    const x = padding + index * (houseWidth + gap);
    const wave = Math.sin(phase * 1.6 + index * 0.65) * 4;
    const roofHeight = houseHeight * 0.25;

    ctx.beginPath();
    ctx.moveTo(x + houseWidth / 2, bodyY - roofHeight + wave);
    ctx.lineTo(x + houseWidth + 5, bodyY + wave);
    ctx.lineTo(x - 5, bodyY + wave);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    fillRoundedRect(
      ctx,
      {
        x,
        y: bodyY + wave,
        width: houseWidth,
        height: houseHeight,
      },
      8,
      'rgba(245, 247, 242, 0.92)',
    );
    strokeRoundedRect(
      ctx,
      {
        x,
        y: bodyY + wave,
        width: houseWidth,
        height: houseHeight,
      },
      8,
      'rgba(16, 24, 31, 0.24)',
      2,
    );

    ctx.fillStyle = color;
    ctx.fillRect(
      x + houseWidth * 0.18,
      bodyY + houseHeight * 0.38 + wave,
      houseWidth * 0.22,
      houseHeight * 0.2,
    );
    ctx.fillRect(
      x + houseWidth * 0.6,
      bodyY + houseHeight * 0.38 + wave,
      houseWidth * 0.22,
      houseHeight * 0.2,
    );

    fillRoundedRect(
      ctx,
      {
        x: x + houseWidth * 0.38,
        y: bodyY + houseHeight * 0.68 + wave,
        width: houseWidth * 0.24,
        height: houseHeight * 0.32,
      },
      5,
      '#10181f',
    );

    drawFittedText(
      ctx,
      String(index + 1),
      x + houseWidth / 2,
      bodyY + houseHeight * 0.17 + wave,
      houseWidth * 0.7,
      24,
      12,
      { color: '#10181f' },
    );

    drawFittedText(
      ctx,
      houseLabels[index],
      x + houseWidth / 2,
      bodyY + houseHeight + 22 + wave,
      houseWidth,
      16,
      9,
      { color: '#fffaf0', weight: 800 },
    );
  });

  drawFittedText(
    ctx,
    'Zebra canvas mock',
    width / 2,
    Math.max(28, height * 0.09),
    width * 0.72,
    30,
    14,
  );
}

function ZebraGame({ resources }: GameRuntimeProps) {
  const canvasRef = useCanvasRenderer(paintZebraScene, {
    animated: true,
    blockPageGestures: true,
  });

  const emitCanvasPress = useCallback(
    () =>
      resources.emit({
        type: 'zebra.canvas.press',
        payload: {
          mocked: true,
        },
      }),
    [resources],
  );

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas zebra-game-canvas"
      aria-label="Zebra canvas mock game"
      onPointerDown={emitCanvasPress}
    />
  );
}

const zebraGame: GameModule = {
  name: 'Zebra',
  catalog: {
    coverImage,
    previewGif,
    accent: '#e0b84f',
    size: 3,
  },
  Game: ZebraGame,
};

export default zebraGame;
