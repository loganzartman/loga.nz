'use client';

import {useEffect, useImperativeHandle, useState} from 'react';
import React from 'react';

import {ComputedCache} from '@/app/reacjin/ComputedCache';
import {Layers} from '@/app/reacjin/layer';
import {LoadingOverlay} from '@/app/reacjin/LoadingOverlay';
import {pluginByID} from '@/app/reacjin/plugins/registry';
import styles from '@/app/reacjin/styles.module.css';

export const ImageCanvas = React.forwardRef(
  (
    {
      width,
      height,
      zoom,
      layers,
      computing,
      computedCache,
    }: {
      width: number;
      height: number;
      zoom: number;
      layers: Layers;
      computing: boolean;
      computedCache: ComputedCache;
    },
    ref,
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [dataURL, setDataURL] = useState<string>('');

    useImperativeHandle(ref, () => canvasRef.current);

    useEffect(() => {
      if (computing) return;
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d')!;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      for (let i = layers.length - 1; i >= 0; --i) {
        const layer = layers[i];
        const plugin = pluginByID(layer.pluginID);
        const {options} = layer;
        const {computed} = computedCache.get(layer.pluginID, options) ?? {};
        plugin.draw({ctx, options, computed});
      }

      setDataURL(canvasRef.current.toDataURL());
    }, [computing, computedCache, layers]);

    return (
      <div
        className={`relative p-2 shadow-lg rounded-md ring-1 ring-brand-100/20`}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="hidden"
        ></canvas>
        <img
          src={dataURL}
          className={`${styles.checkerBackground}`}
          style={{
            width: `${(width * zoom).toFixed(0)}px`,
            height: `${(height * zoom).toFixed(0)}px`,
          }}
          alt="Output image"
        />
        {computing && <LoadingOverlay />}
      </div>
    );
  },
);
ImageCanvas.displayName = 'ImageCanvas';
