import clsx from 'clsx';
import {Reorder} from 'framer-motion';
import {useCallback} from 'react';
import {
  MdDeleteForever,
  MdOutlineDragIndicator,
  MdOutlineLayers,
} from 'react-icons/md';

import {Layers} from '@/app/reacjin/layer';
import {Panel} from '@/app/reacjin/Panel';

export function LayerPanel({
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
