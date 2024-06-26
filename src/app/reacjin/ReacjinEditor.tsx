'use client';

import {AnimatePresence} from 'framer-motion';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  MdAddPhotoAlternate,
  MdOutlineClose,
  MdOutlineFileDownload,
  MdOutlineFormatPaint,
  MdOutlineImage,
  MdOutlineTextFields,
} from 'react-icons/md';
import {useLocalStorage} from 'usehooks-ts';

import {Button} from '@/app/reacjin/Button';
import {ComboRange} from '@/app/reacjin/ComboRange';
import {ComputedCache} from '@/app/reacjin/ComputedCache';
import {ExportDialog} from '@/app/reacjin/ExportDialog';
import {FAB} from '@/app/reacjin/FAB';
import {ImageCanvas} from '@/app/reacjin/ImageCanvas';
import {
  createFillLayer,
  createImageLayer,
  createLayer,
  createTextLayer,
  Layer,
  Layers,
} from '@/app/reacjin/layer';
import {LayerPanel} from '@/app/reacjin/LayerPanel';
import {Panel} from '@/app/reacjin/Panel';
import {PanelProvider} from '@/app/reacjin/PanelContext';
import {pluginByID} from '@/app/reacjin/plugins/registry';
import {Toolbar} from '@/app/reacjin/Toolbar';
import {useUndoable} from '@/app/reacjin/useUndoable';
import {MotionDiv} from '@/lib/framer-motion';

export default function ReacjinEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorAreaRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState([256, 256]);
  const [zoom, setZoom] = useState(1);
  const {
    state: layers,
    setState: setLayers,
    undo,
    redo,
  } = useUndoable(
    useLocalStorage<Layers>('reacjin.project.layers', () => [
      createLayer('text', {
        text: 'Hello, world!',
        autoFitText: false,
        fontSize: 32,
        fontName: 'sans-serif',
        fontWeight: 700,
        fillStyle: 'white',
        strokeStyle: 'black',
        strokeWidth: 2,
        textAlign: 'center',
        lineHeight: 1.1,
      }),
      createLayer('image', {src: 'https://picsum.photos/256'}),
    ]),
  );
  const [selectedLayerID, setSelectedLayerID] = useState<string | null>(null);
  const [computedCache] = useState(() => new ComputedCache());
  const [computing, setComputing] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.repeat) return;
      if (event.key === 'z' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        undo();
      }
      if (event.key === 'y' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        redo();
      }
    }
    document.addEventListener('keydown', handler, false);
    return () => document.removeEventListener('keydown', handler, false);
  }, [layers, redo, undo]);

  const setZoomToSize = useCallback(
    (size: number) => {
      const dim = Math.max(...imageSize);
      setZoom(size / dim);
    },
    [imageSize],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDropping(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    setDropping(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // if the dropped thing has an image, create an image layer
      const file = event.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          const newLayer = createImageLayer({src});
          setLayers((layers) => [newLayer, ...layers]);
          setSelectedLayerID(newLayer.id);
        };
        reader.readAsDataURL(file);
        setDropping(false);
        return;
      }

      // if the dropped thing has text, create a text layer
      const text = event.dataTransfer.getData('text');
      if (text) {
        const newLayer = createTextLayer({text});
        setLayers((layers) => [newLayer, ...layers]);
        setSelectedLayerID(newLayer.id);
        setDropping(false);
        return;
      }
    },
    [setLayers],
  );

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!event.clipboardData) return;
      if (event.clipboardData.files.length > 0) {
        const file = event.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const src = event.target?.result as string;
            const newLayer = createImageLayer({src});
            setLayers((layers) => [newLayer, ...layers]);
            setSelectedLayerID(newLayer.id);
          };
          reader.readAsDataURL(file);
        }
      } else {
        const text = event.clipboardData.getData('text');
        if (text) {
          const newLayer = createTextLayer({text});
          setLayers((layers) => [newLayer, ...layers]);
          setSelectedLayerID(newLayer.id);
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [setLayers]);

  const handleSetOptions = useCallback(
    (targetLayer: Layer<string>, options: unknown) => {
      setLayers((layers) =>
        layers.map((layer) =>
          layer.id === targetLayer.id ? {...layer, options} : layer,
        ),
      );
    },
    [setLayers],
  );

  const handleAddImage = useCallback(() => {
    const newLayer = createImageLayer({});
    setLayers((layers) => [newLayer, ...layers]);
    setSelectedLayerID(newLayer.id);
  }, [setLayers]);

  const handleAddText = useCallback(() => {
    const newLayer = createTextLayer({});
    setLayers((layers) => [newLayer, ...layers]);
    setSelectedLayerID(newLayer.id);
  }, [setLayers]);

  const handleAddFill = useCallback(() => {
    const newLayer = createFillLayer({});
    setLayers((layers) => [newLayer, ...layers]);
    setSelectedLayerID(newLayer.id);
  }, [setLayers]);

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

  const computed = selectedLayer
    ? computedCache.get(selectedLayer.pluginID, selectedLayer.options)?.computed
    : null;

  return (
    <PanelProvider>
      <div
        className="absolute left-0 top-0 right-0 bottom-0 flex flex-col items-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
            <div className="absolute right-0 top-0">
              <AnimatePresence>
                {SelectedLayerUIPanel && (
                  <Panel
                    key={selectedLayerID}
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
                    className="absolute right-0 top-0"
                  >
                    <div className="flex flex-col gap-2 p-2">
                      <SelectedLayerUIPanel
                        ctx={canvasRef.current?.getContext('2d')!}
                        options={selectedLayer!.options}
                        setOptions={(options) =>
                          handleSetOptions(selectedLayer!, options)
                        }
                        computed={computed}
                      />
                    </div>
                  </Panel>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <FAB onClick={() => setShowExportDialog(true)}>
          <MdOutlineFileDownload />
        </FAB>
        <AnimatePresence>
          {dropping && (
            <MotionDiv
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="absolute left-0 top-0 right-0 bottom-0 bg-background/50 flex items-center justify-center z-50"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="text-2xl">Drop to add</div>
                <div>
                  <MdAddPhotoAlternate size={64} />
                </div>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
        <ExportDialog
          isOpen={showExportDialog}
          handleClose={() => setShowExportDialog(false)}
          canvas={canvasRef.current}
          filename="reacji"
        />
      </div>
    </PanelProvider>
  );
}
