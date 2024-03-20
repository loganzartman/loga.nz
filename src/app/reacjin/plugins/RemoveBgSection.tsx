import {useState} from 'react';
import {FaWandMagicSparkles} from 'react-icons/fa6';

import {Button} from '@/app/reacjin/Button';
import type {ImageLayerOptions} from '@/app/reacjin/plugins/imageLayer';
import {loadModel, removeBackground} from '@/app/reacjin/removeBackground';
import {Section} from '@/app/reacjin/Section';

export function RemoveBgSection({
  ctx,
  options,
  setOptions,
}: {
  ctx: CanvasRenderingContext2D;
  options: ImageLayerOptions;
  setOptions: (options: ImageLayerOptions) => void;
}) {
  const [statusText, setStatusText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | undefined>();

  const handleRemoveBg = async () => {
    setLoading(true);
    setProgress(0);
    setStatusText('Downloading model...');

    await loadModel({onProgress: setProgress});

    setProgress(undefined);
    setStatusText('Removing background...');

    await new Promise((resolve) => setTimeout(resolve, 100));

    const newImage = await removeBackground(
      ctx.canvas,
      ctx.canvas.width,
      ctx.canvas.height,
    );
    ctx.save();
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(newImage, 0, 0);
    ctx.restore();
    setOptions({...options, src: ctx.canvas.toDataURL()});
    setLoading(false);
  };

  return (
    <Section label="Magic">
      <div className="flex flex-col gap-1">
        <Button
          disabled={loading}
          icon={<FaWandMagicSparkles />}
          onClick={handleRemoveBg}
        >
          Remove background
        </Button>
        {loading && statusText && <div>{statusText}</div>}
        {loading && (
          <progress
            className="progress progress-primary"
            value={progress}
            max="1"
          ></progress>
        )}
      </div>
    </Section>
  );
}
