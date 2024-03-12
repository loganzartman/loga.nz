import {
  drawStyledText,
  measureStyledText,
  StyledText,
  StyledTextStyle,
} from 'canvas-styled-text';

import {PanelRow} from '@/app/reacjin/PanelRow';
import {LayerPlugin} from '@/app/reacjin/plugins/types';

export type TextLayerOptions = {
  text: string;
  autoFitText: boolean;
  fontSize: number;
  fontFamily: string;
  fillStyle: string;
  strokeStyle: string;
  strokeWidth: number;
  textAlign: CanvasTextAlign;
};

function getBestFitFontSize(
  ctx: CanvasRenderingContext2D,
  text: StyledText,
  baseStyle: StyledTextStyle,
  fontFamily: string,
  fontSize: number,
  desiredWidth: number,
  maxSteps: number = 8,
  minSize: number = 8,
  maxSize: number = ctx.canvas.width,
): number {
  console.log(fontSize, maxSteps);
  if (maxSteps <= 0) return fontSize;
  const metrics = measureStyledText(ctx, text, {
    ...baseStyle,
    font: `${fontSize.toFixed(1)}px ${fontFamily}`,
  });
  const width = metrics.width;
  if (width < desiredWidth)
    return getBestFitFontSize(
      ctx,
      text,
      baseStyle,
      fontFamily,
      fontSize + (maxSize - fontSize) * 0.5,
      desiredWidth,
      maxSteps - 1,
      fontSize,
      maxSize,
    );
  else
    return getBestFitFontSize(
      ctx,
      text,
      baseStyle,
      fontFamily,
      fontSize + (minSize - fontSize) * 0.5,
      desiredWidth,
      maxSteps - 1,
      minSize,
      fontSize,
    );
}

const getStyle = (options: TextLayerOptions): StyledTextStyle => ({
  font: `${options.fontSize}px ${options.fontFamily}`,
  fill: options.fillStyle,
  stroke: options.strokeStyle,
  strokeWidth: options.strokeWidth,
  align: options.textAlign,
  baseline: 'middle',
});

export const textLayerPlugin: LayerPlugin<TextLayerOptions> = {
  draw: (ctx, options) => {
    const baseStyle = getStyle(options);
    ctx.lineJoin = 'round';
    drawStyledText(
      ctx,
      options.text,
      ctx.canvas.width / 2,
      ctx.canvas.height / 2,
      baseStyle,
    );
  },
  UIPanel: ({ctx, options, setOptions}) => {
    if (options.autoFitText) {
      const baseStyle = getStyle(options);
      const fontSize = Math.round(
        getBestFitFontSize(
          ctx,
          options.text,
          baseStyle,
          options.fontFamily,
          50,
          ctx.canvas.width,
        ),
      );
      if (fontSize !== options.fontSize) {
        setOptions({
          ...options,
          fontSize,
        });
      }
    }

    return (
      <>
        <PanelRow label="text">
          <textarea
            value={options.text}
            onChange={(e) =>
              setOptions({
                ...options,
                text: e.currentTarget.value,
              })
            }
          />
        </PanelRow>
        <PanelRow label="auto-fit text">
          <input
            type="checkbox"
            checked={options.autoFitText}
            onChange={(e) =>
              setOptions({
                ...options,
                autoFitText: e.currentTarget.checked,
              })
            }
          />
        </PanelRow>
        <PanelRow label="font size">
          <input
            className={options.autoFitText ? 'disabled' : ''}
            type="text"
            value={options.fontSize}
            onChange={(e) =>
              setOptions({
                ...options,
                fontSize: e.currentTarget.valueAsNumber,
              })
            }
          />
        </PanelRow>
        <PanelRow label="font family">
          <input
            type="text"
            value={options.fontFamily}
            onChange={(e) =>
              setOptions({
                ...options,
                fontFamily: e.currentTarget.value,
              })
            }
          />
        </PanelRow>
        <PanelRow label="fill style">
          <input
            type="text"
            value={options.fillStyle}
            onChange={(e) =>
              setOptions({
                ...options,
                fillStyle: e.currentTarget.value,
              })
            }
          />
        </PanelRow>
        <PanelRow label="stroke style">
          <input
            type="text"
            value={options.strokeStyle}
            onChange={(e) =>
              setOptions({
                ...options,
                strokeStyle: e.currentTarget.value,
              })
            }
          />
        </PanelRow>
        <PanelRow label="stroke width">
          <input
            type="number"
            value={options.strokeWidth}
            onChange={(e) =>
              setOptions({
                ...options,
                strokeWidth: parseInt(e.currentTarget.value),
              })
            }
          />
        </PanelRow>
        <PanelRow label="text align">
          <select
            value={options.textAlign}
            onChange={(e) =>
              setOptions({
                ...options,
                textAlign: e.currentTarget.value as CanvasTextAlign,
              })
            }
          >
            <option value="left">left</option>
            <option value="right">right</option>
            <option value="center">center</option>
          </select>
        </PanelRow>
      </>
    );
  },
};
