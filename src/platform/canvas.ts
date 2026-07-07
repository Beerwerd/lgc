import { useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';

export type CanvasPainter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
) => void;

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function useCanvasRenderer(
  painter: CanvasPainter,
  {
    animated = false,
    blockPageGestures = false,
  }: { animated?: boolean; blockPageGestures?: boolean } = {},
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !blockPageGestures) {
      return undefined;
    }

    const preventDefault = (event: Event) => {
      event.preventDefault();
    };
    const listenerOptions = { passive: false };

    canvas.addEventListener('wheel', preventDefault, listenerOptions);
    canvas.addEventListener('touchmove', preventDefault, listenerOptions);
    canvas.addEventListener('gesturestart', preventDefault, listenerOptions);
    canvas.addEventListener('gesturechange', preventDefault, listenerOptions);

    return () => {
      canvas.removeEventListener('wheel', preventDefault);
      canvas.removeEventListener('touchmove', preventDefault);
      canvas.removeEventListener('gesturestart', preventDefault);
      canvas.removeEventListener('gesturechange', preventDefault);
    };
  }, [blockPageGestures]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    let animationFrame = 0;
    let resizeFrame = 0;
    const startedAt = performance.now();

    const paintAt = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.max(1, Math.round(width * ratio));
      const pixelHeight = Math.max(1, Math.round(height * ratio));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      painter(ctx, width, height, (time - startedAt) / 1000);
    };

    const schedulePaint = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(paintAt);
    };

    const animate = (time: number) => {
      paintAt(time);

      if (animated) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const resizeObserver = new ResizeObserver(schedulePaint);
    resizeObserver.observe(canvas);

    schedulePaint();

    if (animated) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
    };
  }, [animated, painter]);

  return canvasRef;
}

export function getCanvasPoint(
  canvas: HTMLCanvasElement,
  event: PointerEvent<HTMLCanvasElement>,
) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

export function roundedRect(
  ctx: CanvasRenderingContext2D,
  { x, y, width, height }: Rect,
  radius: number,
) {
  const resolvedRadius = Math.max(0, Math.min(radius, width / 2, height / 2));

  ctx.beginPath();
  ctx.moveTo(x + resolvedRadius, y);
  ctx.lineTo(x + width - resolvedRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + resolvedRadius);
  ctx.lineTo(x + width, y + height - resolvedRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - resolvedRadius, y + height);
  ctx.lineTo(x + resolvedRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - resolvedRadius);
  ctx.lineTo(x, y + resolvedRadius);
  ctx.quadraticCurveTo(x, y, x + resolvedRadius, y);
  ctx.closePath();
}

export function fillRoundedRect(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  radius: number,
  fillStyle: string | CanvasGradient,
) {
  roundedRect(ctx, rect, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

export function strokeRoundedRect(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  radius: number,
  strokeStyle: string,
  lineWidth = 1,
) {
  roundedRect(ctx, rect, radius);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

export function getFittedFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number,
  fontWeight = 800,
) {
  let size = maxSize;

  while (size > minSize) {
    ctx.font = `${fontWeight} ${size}px Inter, system-ui, sans-serif`;

    if (ctx.measureText(text).width <= maxWidth) {
      return size;
    }

    size -= 1;
  }

  return minSize;
}

export function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxSize: number,
  minSize: number,
  options: {
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    color?: string;
    weight?: number;
  } = {},
) {
  const size = getFittedFontSize(
    ctx,
    text,
    maxWidth,
    maxSize,
    minSize,
    options.weight,
  );

  ctx.font = `${options.weight ?? 800} ${size}px Inter, system-ui, sans-serif`;
  ctx.textAlign = options.align ?? 'center';
  ctx.textBaseline = options.baseline ?? 'middle';
  ctx.fillStyle = options.color ?? '#fffaf0';
  ctx.fillText(text, x, y);
}

export function containsPoint(rect: Rect, point: { x: number; y: number }) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}
