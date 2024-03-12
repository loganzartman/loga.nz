export interface LayerPlugin<Options> {
  draw(ctx: CanvasRenderingContext2D, options: Options): void;
  UIPanel?: React.FC<{
    ctx: CanvasRenderingContext2D;
    options: Options;
    setOptions: (options: Options) => void;
  }>;
}
