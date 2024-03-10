'use client';

import {Reorder} from 'framer-motion';
import {Nunito, Overpass, Work_Sans} from 'next/font/google';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {v4 as uuid} from 'uuid';

import {Button} from '@/app/reacjin/Button';
import {Panel} from '@/app/reacjin/Panel';
import {PluginByID, pluginByID, PluginOptions} from '@/app/reacjin/plugins';
import styles from '@/app/reacjin/styles.module.css';
import {Toolbar} from '@/app/reacjin/Toolbar';

const nunito = Nunito({weight: 'variable', preload: false});
const workSans = Work_Sans({weight: 'variable', preload: false});
const overpass = Overpass({weight: 'variable', preload: false});

const fonts = [nunito, overpass, workSans];

type Layer<PluginID> = {
  id: string;
  pluginID: PluginID;
  options: PluginOptions<PluginByID<PluginID>>;
};

type Layers = Layer<unknown>[];

function ImageCanvas({
  width,
  height,
  zoom,
  layers,
}: {
  width: number;
  height: number;
  zoom: number;
  layers: Layers;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = layers.length - 1; i >= 0; --i) {
      const layer = layers[i];
      const plugin = pluginByID(layer.pluginID);
      plugin.draw(ctx, layer.options);
    }
  }, [layers]);

  return (
    <div className="p-2 shadow-lg rounded-md ring-1 ring-brand-100/20">
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

function LayerPanel({
  layers,
  setLayers,
  selectedLayerID,
  setSelectedLayerID,
}: {
  layers: Layers;
  setLayers: React.Dispatch<React.SetStateAction<Layers>>;
  selectedLayerID: string | null;
  setSelectedLayerID: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const handleDelete = useCallback(
    (targetId: string) => {
      setLayers((layers) => layers.filter(({id}) => id !== targetId));
    },
    [setLayers],
  );

  return (
    <Panel title="Layers" className="w-[20ch]">
      <Reorder.Group
        axis="y"
        values={layers}
        onReorder={setLayers}
        className="flex-1 overflow-hidden flex flex-col"
      >
        {layers.map((layer) => (
          <Reorder.Item key={layer.id} id={layer.id} value={layer}>
            <div
              className={`p-2 transition-colors flex flex-row ${
                layer.id === selectedLayerID
                  ? 'bg-brand-400 text-background'
                  : 'hover:bg-brand-400/20'
              }`}
            >
              <div className="mr-2 text-opacity-50">⋮⋮</div>
              <button
                onClick={() => setSelectedLayerID(layer.id)}
                className="flex-1"
              >
                {layer.pluginID as string}
              </button>
              <button onClick={() => handleDelete(layer.id)}>❌</button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Panel>
  );
}

export function ReacjinEditor() {
  const [imageSize, setImageSize] = useState([256, 256]);
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState<Layers>([
    {
      id: uuid(),
      pluginID: 'text',
      options: {text: 'Hello, world!', font: '20px sans-serif'},
    },
    {id: uuid(), pluginID: 'image', options: {}},
    {id: uuid(), pluginID: 'fill', options: {fillStyle: 'purple'}},
  ]);
  const [selectedLayerID, setSelectedLayerID] = useState<string | null>(null);

  const setZoomToSize = useCallback(
    (size: number) => {
      const dim = Math.max(...imageSize);
      setZoom(size / dim);
    },
    [imageSize],
  );

  const handleSetOptions = useCallback(
    (targetLayer: Layer<unknown>, options: unknown) => {
      setLayers((layers) =>
        layers.map((layer) =>
          layer.id === targetLayer.id ? {...layer, options} : layer,
        ),
      );
    },
    [],
  );

  const selectedLayer = layers.find((layer) => layer.id === selectedLayerID);
  const SelectedLayerUIPanel = selectedLayer
    ? pluginByID(selectedLayer.pluginID).UIPanel
    : null;

  return (
    <div className="absolute left-0 top-0 right-0 bottom-0 flex flex-col items-center">
      <div className="flex flex-row items-center">
        <div className="text-2xl mr-2" title="rē-ˈak-shən">
          reacjin
        </div>
        <div>simple reacji editor</div>
      </div>
      <div className="flex flex-row gap-2 items-center p-2">
        <Toolbar label="zoom">
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
        </Toolbar>
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
        <div className="absolute right-8 top-8 flex flex-col items-end gap-4">
          <LayerPanel
            layers={layers}
            setLayers={setLayers}
            selectedLayerID={selectedLayerID}
            setSelectedLayerID={setSelectedLayerID}
          />
          {SelectedLayerUIPanel && (
            <SelectedLayerUIPanel
              options={selectedLayer!.options}
              setOptions={(options) =>
                handleSetOptions(selectedLayer!, options)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
