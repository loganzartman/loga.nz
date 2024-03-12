'use client';

import {Reorder} from 'framer-motion';
import {Nunito, Overpass, Work_Sans} from 'next/font/google';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  MdDeleteForever,
  MdOutlineClose,
  MdOutlineDragIndicator,
  MdOutlineFileDownload,
} from 'react-icons/md';
import {v4 as uuid} from 'uuid';

import {Button} from '@/app/reacjin/Button';
import {ComboRange} from '@/app/reacjin/ComboRange';
import {FAB} from '@/app/reacjin/FAB';
import {Panel} from '@/app/reacjin/Panel';
import {
  PluginByID,
  pluginByID,
  PluginOptions,
} from '@/app/reacjin/plugins/registry';
import {TextLayerOptions} from '@/app/reacjin/plugins/textLayer';
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

const ImageCanvas = React.forwardRef(
  (
    {
      width,
      height,
      zoom,
      layers,
    }: {
      width: number;
      height: number;
      zoom: number;
      layers: Layers;
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current);

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
      <div className={`p-2 shadow-lg rounded-md ring-1 ring-brand-100/20`}>
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
  },
);
ImageCanvas.displayName = 'ImageCanvas';

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
              className={`p-2 transition-colors flex flex-row items-center ${
                layer.id === selectedLayerID
                  ? 'bg-brand-400 text-background'
                  : 'hover:bg-brand-400/20'
              }`}
            >
              <div className="text-opacity-50">
                <MdOutlineDragIndicator />
              </div>
              <button
                onClick={() => setSelectedLayerID(layer.id)}
                className="flex-1"
              >
                {layer.pluginID as string}
              </button>
              <button onClick={() => handleDelete(layer.id)}>
                <MdDeleteForever className="text-red-400" />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Panel>
  );
}

export function ReacjinEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSize, setImageSize] = useState([256, 256]);
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState<Layers>([
    {
      id: uuid(),
      pluginID: 'text',
      options: {
        text: 'Hello, world!',
        autoFitText: false,
        fontSize: 32,
        fontFamily: 'sans-serif',
        fillStyle: 'white',
        strokeStyle: 'black',
        strokeWidth: 2,
        textAlign: 'center',
      } satisfies TextLayerOptions,
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

  const handleDownloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reacji.png';
    a.click();
  }, []);

  const selectedLayer = layers.find((layer) => layer.id === selectedLayerID);
  const selectedLayerPlugin = selectedLayer
    ? pluginByID(selectedLayer.pluginID)
    : null;
  const SelectedLayerUIPanel = selectedLayerPlugin?.UIPanel;

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
          <ComboRange
            min={1}
            max={400}
            step={1}
            value={zoom * 100}
            onChange={(value) => setZoom(value / 100)}
          />
          <Button onClick={() => setZoomToSize(16)}>Reaction</Button>
          <Button onClick={() => setZoomToSize(64)}>Hover</Button>
          <Button onClick={() => setZoom(1)}>100%</Button>
        </Toolbar>
      </div>
      <div className="relative w-full h-full flex-1">
        <div className="absolute left-0 top-0 right-0 bottom-0 overflow-auto flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <ImageCanvas
              ref={canvasRef}
              width={imageSize[0]}
              height={imageSize[1]}
              zoom={zoom}
              layers={layers}
            />
          </div>
        </div>
        <div className="absolute left-8 top-8 flex flex-col items-end gap-4">
          <LayerPanel
            layers={layers}
            setLayers={setLayers}
            selectedLayerID={selectedLayerID}
            setSelectedLayerID={setSelectedLayerID}
          />
        </div>
        <div className="absolute right-8 top-8 flex flex-col items-end gap-4">
          {SelectedLayerUIPanel && (
            <Panel
              title={`Settings: ${selectedLayer?.pluginID}`}
              buttons={
                <button
                  onClick={() => setSelectedLayerID(null)}
                  className="p-2 -m-1"
                >
                  <MdOutlineClose />
                </button>
              }
            >
              <div className="flex flex-col gap-2 p-2">
                <SelectedLayerUIPanel
                  ctx={canvasRef.current?.getContext('2d')!}
                  options={selectedLayer!.options}
                  setOptions={(options) =>
                    handleSetOptions(selectedLayer!, options)
                  }
                />
              </div>
            </Panel>
          )}
        </div>
      </div>
      <FAB onClick={handleDownloadImage}>
        <MdOutlineFileDownload />
      </FAB>
    </div>
  );
}
