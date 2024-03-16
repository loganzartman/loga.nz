'use client';

import clsx from 'clsx';
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
  MdOutlineFormatPaint,
  MdOutlineImage,
  MdOutlineLayers,
  MdOutlineTextFields,
} from 'react-icons/md';

import {Button} from '@/app/reacjin/Button';
import {ComboRange} from '@/app/reacjin/ComboRange';
import {ComputedCache} from '@/app/reacjin/ComputedCache';
import {FAB} from '@/app/reacjin/FAB';
import {
  createFillLayer,
  createImageLayer,
  createLayer,
  createTextLayer,
  Layer,
  Layers,
} from '@/app/reacjin/layer';
import {LoadingOverlay} from '@/app/reacjin/LoadingOverlay';
import {Panel} from '@/app/reacjin/Panel';
import {PanelProvider} from '@/app/reacjin/PanelContext';
import {pluginByID} from '@/app/reacjin/plugins/registry';
import styles from '@/app/reacjin/styles.module.css';
import {Toolbar} from '@/app/reacjin/Toolbar';

const nunito = Nunito({weight: 'variable', preload: false});
const workSans = Work_Sans({weight: 'variable', preload: false});
const overpass = Overpass({weight: 'variable', preload: false});

const fonts = [nunito, overpass, workSans];

const ImageCanvas = React.forwardRef(
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
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
    }, [computing, computedCache, layers]);

    return (
      <div
        className={`relative p-2 shadow-lg rounded-md ring-1 ring-brand-100/20`}
      >
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
        {computing && <LoadingOverlay />}
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
  dragConstraints,
}: {
  layers: Layers;
  setLayers: React.Dispatch<React.SetStateAction<Layers>>;
  selectedLayerID: string | null;
  setSelectedLayerID: React.Dispatch<React.SetStateAction<string | null>>;
  dragConstraints: React.RefObject<HTMLElement>;
}) {
  const handleDelete = useCallback(
    (targetId: string) => {
      setLayers((layers) => layers.filter(({id}) => id !== targetId));
    },
    [setLayers],
  );

  return (
    <Panel
      title="Layers"
      icon={<MdOutlineLayers />}
      dragConstraints={dragConstraints}
      className="w-[20ch]"
    >
      <Reorder.Group
        axis="y"
        values={layers}
        onReorder={setLayers}
        className="flex-1 overflow-hidden flex flex-col"
      >
        {layers.map((layer) => (
          <Reorder.Item key={layer.id} id={layer.id} value={layer}>
            <div
              className={clsx(
                'transition-colors flex flex-row items-stretch',
                layer.id === selectedLayerID
                  ? 'bg-brand-400 text-background'
                  : 'hover:bg-brand-400/20',
              )}
            >
              <button
                onClick={() => setSelectedLayerID(layer.id)}
                className="flex-1 p-2 flex gap-2 items-center"
              >
                <MdOutlineDragIndicator />
                <div className="flex-1">{layer.pluginID as string}</div>
              </button>
              <div className="p-2 flex items-center">
                <button
                  onClick={() => handleDelete(layer.id)}
                  className="bg-red-400 text-background text-lg rounded-lg p-0.5"
                >
                  <MdDeleteForever />
                </button>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Panel>
  );
}

export function ReacjinEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorAreaRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState([256, 256]);
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState<Layers>(() => [
    createLayer('text', {
      text: 'Hello, world!',
      autoFitText: false,
      fontSize: 32,
      fontFamily: 'sans-serif',
      fillStyle: 'white',
      strokeStyle: 'black',
      strokeWidth: 2,
      textAlign: 'center',
      lineHeight: 1.1,
    }),
    createLayer('image', {src: 'https://picsum.photos/256'}),
  ]);
  const [selectedLayerID, setSelectedLayerID] = useState<string | null>(null);
  const [computedCache] = useState(() => new ComputedCache());
  const [computing, setComputing] = useState(false);

  const setZoomToSize = useCallback(
    (size: number) => {
      const dim = Math.max(...imageSize);
      setZoom(size / dim);
    },
    [imageSize],
  );

  const handleSetOptions = useCallback(
    (targetLayer: Layer<string>, options: unknown) => {
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

  const handleAddImage = useCallback(() => {
    setLayers((layers) => [createImageLayer({}), ...layers]);
  }, []);

  const handleAddText = useCallback(() => {
    setLayers((layers) => [
      createTextLayer({
        text: 'Hello, world!',
      }),
      ...layers,
    ]);
  }, []);

  const handleAddFill = useCallback(() => {
    setLayers((layers) => [createFillLayer({fillStyle: 'purple'}), ...layers]);
  }, []);

  // TODO: clean up all computed results on unmount

  const selectedLayer = layers.find((layer) => layer.id === selectedLayerID);
  const selectedLayerPlugin = selectedLayer
    ? pluginByID(selectedLayer.pluginID)
    : null;
  const SelectedLayerUIPanel = selectedLayerPlugin?.UIPanel;

  if (!computing && computedCache.anyOutdated(layers)) {
    setComputing(true);
    computedCache.computeOutdated(layers).then(() => setComputing(false));
    return null;
  }

  return (
    <PanelProvider>
      <div className="absolute left-0 top-0 right-0 bottom-0 flex flex-col items-center">
        <div className="flex flex-row items-center"></div>
        <div className="flex flex-row gap-2 items-center p-2">
          <Toolbar label="Zoom">
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
          <Toolbar label="Add">
            <Button onClick={handleAddImage} icon={<MdOutlineImage />}>
              Image
            </Button>
            <Button onClick={handleAddText} icon={<MdOutlineTextFields />}>
              Text
            </Button>
            <Button onClick={handleAddFill} icon={<MdOutlineFormatPaint />}>
              Fill
            </Button>
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
                computing={computing}
                computedCache={computedCache}
              />
            </div>
          </div>
          <div
            ref={editorAreaRef}
            className="absolute left-8 top-8 right-8 bottom-8"
          >
            <div className="absolute left-0 top-0 flex flex-col items-end gap-4">
              <LayerPanel
                layers={layers}
                setLayers={setLayers}
                selectedLayerID={selectedLayerID}
                setSelectedLayerID={setSelectedLayerID}
                dragConstraints={editorAreaRef}
              />
            </div>
            <div className="absolute right-0 top-0 flex flex-col items-end gap-4">
              {SelectedLayerUIPanel && (
                <Panel
                  title={`Layer settings: ${selectedLayer?.pluginID}`}
                  buttons={
                    <button
                      onClick={() => setSelectedLayerID(null)}
                      className="p-2 -m-1"
                    >
                      <MdOutlineClose />
                    </button>
                  }
                  dragConstraints={editorAreaRef}
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
        </div>
        <FAB onClick={handleDownloadImage}>
          <MdOutlineFileDownload />
        </FAB>
      </div>
    </PanelProvider>
  );
}
