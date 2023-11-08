'use client';

import {useCallback, useRef} from 'react';

import {useAnimationFrame} from '@/lib/useAnimationFrame';
import {useElementSize} from '@/lib/useElementSize';

export default function Canvas({
  w,
  h,
  draw,
}: {
  w: number;
  h: number;
  draw: (_: CanvasRenderingContext2D) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerSize = useElementSize(containerRef);
  const canvasSize = [containerSize[0], (containerSize[0] * h) / w];
  const callbackRef = useRef<(_: CanvasRenderingContext2D) => void>();
  callbackRef.current = draw;

  useAnimationFrame(
    useCallback(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas2d context!');

        ctx.resetTransform();
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.scale(
          (window.devicePixelRatio * canvas.width) / w,
          (window.devicePixelRatio * canvas.height) / h,
        );

        callbackRef.current?.(ctx);
      }
    }, [w, h]),
  );

  return (
    <div ref={containerRef} className="relative">
      <canvas
        ref={canvasRef}
        width={Math.ceil(canvasSize[0] * window.devicePixelRatio)}
        height={Math.ceil(canvasSize[1] * window.devicePixelRatio)}
        className="absolute left-0 top-0"
        style={{
          width: `${canvasSize[0]}px`,
          height: `${canvasSize[1]}px`,
        }}
      ></canvas>
    </div>
  );
}
