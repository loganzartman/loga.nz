'use client';

import {Reorder} from 'framer-motion';
import {Nunito, Overpass, Work_Sans} from 'next/font/google';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Button} from '@/app/reacjin/Button';
import styles from '@/app/reacjin/styles.module.css';

const nunito = Nunito({weight: 'variable', preload: false});
const workSans = Work_Sans({weight: 'variable', preload: false});
const overpass = Overpass({weight: 'variable', preload: false});

const fonts = [nunito, overpass, workSans];

function uuid() {
  return window.crypto.randomUUID();
}

type RenderFunction<O> = (ctx: CanvasRenderingContext2D, options: O) => void;

type LayerPlugin<N, O> = {name: N; render: RenderFunction<O>};

const image = new Image();
image.src =
  'https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_4x3.jpg?w=256&h=256';

const imageLayerPlugin: LayerPlugin<'image', {}> = {
  name: 'image',
  render: (ctx, options) => {
    ctx.drawImage(image, 0, 0);
  },
};

const textLayerPlugin: LayerPlugin<'text', {}> = {
  name: 'text',
  render: (ctx, options) => {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Test', ctx.canvas.width / 2, ctx.canvas.height / 2);
  },
};

const layerPlugins = {
  image: imageLayerPlugin,
  text: textLayerPlugin,
} as const;

type Layer = {id: string; plugin: keyof typeof layerPlugins; options: unknown};

function ImageCanvas({
  width,
  height,
  zoom,
  layers,
}: {
  width: number;
  height: number;
  zoom: number;
  layers: Layer[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;

    for (const layer of layers) {
      layerPlugins[layer.plugin].render(ctx, {});
    }
  }, [layers]);

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

function LayerPane({
  layers,
  setLayers,
}: {
  layers: Layer[];
  setLayers: React.Dispatch<Layer[]>;
}) {
  const items = layers.map((layer) => (
    <Reorder.Item
      key={layer.id}
      value={layer}
      className="p-2 transition-colors hover:bg-brand-400/20 flex flex-row"
    >
      <div className="text-brand-100/50 mr-2">⋮⋮</div>
      <div>{layer.plugin}</div>
    </Reorder.Item>
  ));

  return (
    <div className="w-[20ch] bg-background ring-1 ring-brand-200 rounded-lg m-2 flex flex-col">
      <div className="p-2 bg-brand-100/10">Layers</div>
      <Reorder.Group
        className="overflow-hidden"
        values={layers}
        onReorder={setLayers}
      >
        {items}
      </Reorder.Group>
    </div>
  );
}

export function ReacjinEditor() {
  const [imageSize, setImageSize] = useState([256, 256]);
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState<Layer[]>([
    {id: '0', plugin: 'image', options: {}},
    {id: '1', plugin: 'text', options: {}},
  ]);

  const setZoomToSize = useCallback(
    (size: number) => {
      const dim = Math.max(...imageSize);
      setZoom(size / dim);
    },
    [imageSize],
  );

  return (
    <div className="absolute left-0 top-0 right-0 bottom-0 flex flex-col items-center">
      <div className="text-2xl" title="rē-ˈak-shən">
        reacjin
      </div>
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
          <ImageCanvas
            width={imageSize[0]}
            height={imageSize[1]}
            zoom={zoom}
            layers={layers}
          />
        </div>
        <div className="absolute right-0 top-0">
          <LayerPane layers={layers} setLayers={setLayers} />
        </div>
      </div>
    </div>
  );
}
