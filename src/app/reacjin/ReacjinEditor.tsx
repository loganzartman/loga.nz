'use client';

import {Nunito, Overpass, Work_Sans} from 'next/font/google';
import {useCallback, useRef, useState} from 'react';

import {Button} from '@/app/reacjin/Button';
import styles from '@/app/reacjin/styles.module.css';

const nunito = Nunito({weight: 'variable', preload: false});
const workSans = Work_Sans({weight: 'variable', preload: false});
const overpass = Overpass({weight: 'variable', preload: false});

const fonts = [nunito, overpass, workSans];

function ImageCanvas({
  width,
  height,
  zoom,
}: {
  width: number;
  height: number;
  zoom: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <div className="p-1 shadow-lg rounded-md ring-1 ring-[rgba(255,255,255,0.5)]">
      <canvas
        ref={canvasRef}
        className={`${styles.checkerBackground}`}
        style={{
          width: `${(width * zoom).toFixed(0)}px`,
          height: `${(height * zoom).toFixed(0)}px`,
        }}
        width={width}
        height={height}
      ></canvas>
    </div>
  );
}

export function ReacjinEditor() {
  const [imageSize, setImageSize] = useState([256, 256]);
  const [zoom, setZoom] = useState(1);

  const setZoomToSize = useCallback(
    (size: number) => {
      const dim = Math.max(...imageSize);
      setZoom(size / dim);
    },
    [imageSize],
  );

  return (
    <div className="absolute left-0 top-0 right-0 bottom-0 flex flex-col items-center">
      <div className="text-2xl">reacjin editor</div>
      <div className="flex flex-row gap-2 items-center p-2">
        <div>zoom</div>
        <input
          type="range"
          min={1}
          max={400}
          step={1}
          value={zoom * 100}
          onChange={(e) => setZoom(Number.parseFloat(e.target.value) / 100)}
        />
        <div className="w-[5ch]">{(zoom * 100).toFixed(0)}%</div>
        <Button onClick={() => setZoomToSize(16)}>Reaction</Button>
        <Button onClick={() => setZoomToSize(64)}>Hover</Button>
        <Button onClick={() => setZoom(1)}>100%</Button>
      </div>
      <div className="relative w-full h-full flex-1">
        <div className="absolute left-0 top-0 right-0 bottom-0 overflow-auto flex flex-col items-center justify-center">
          <ImageCanvas width={imageSize[0]} height={imageSize[1]} zoom={zoom} />
        </div>
      </div>
    </div>
  );
}
