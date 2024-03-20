import * as ort from 'onnxruntime-web';
import ortWasmPath from 'onnxruntime-web-dist/ort-wasm.wasm';
import ortWasmSimdPath from 'onnxruntime-web-dist/ort-wasm-simd.wasm';

import modelPath from '@/app/reacjin/models/u2net.onnx';

type FetchModelArgs = {
  onProgress?: (progress: number) => void;
  abortSignal?: AbortSignal;
};

let onnxSession: ort.InferenceSession | null = null;

async function fetchModelData({onProgress, abortSignal}: FetchModelArgs) {
  const response = await fetch(modelPath, {signal: abortSignal});
  if (!response.ok) {
    throw new Error('Failed to load model');
  }
  if (!response.body) {
    throw new Error('No response body');
  }

  const contentLength = Number.parseInt(
    response.headers.get('Content-Length') ?? '1',
    10,
  );

  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    chunks.push(value);
    totalBytes += value.byteLength;
    onProgress?.(totalBytes / contentLength);
  }

  return new Blob(chunks).arrayBuffer();
}

export async function loadModel(
  args: FetchModelArgs = {},
): Promise<ort.InferenceSession> {
  if (onnxSession) return onnxSession;
  console.log('Fetching model');
  const modelData = await fetchModelData(args);
  console.log('Loading model');
  ort.env.wasm.wasmPaths = {
    'ort-wasm.wasm': ortWasmPath,
    'ort-wasm-simd.wasm': ortWasmSimdPath,
  };
  onnxSession = await ort.InferenceSession.create(modelData);
  console.log('Model loaded');
  return onnxSession;
}

function resizeImage(
  image: CanvasImageSource,
  width: number,
  height: number,
): OffscreenCanvas {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0, width, height);
  return canvas;
}

function softmax(resultArray: number[]): any {
  // Get the largest value in the array.
  const largestNumber = Math.max(...resultArray);
  // Apply exponential function to each result item subtracted by the largest number, use reduce to get the previous result number and the current number to sum all the exponentials results.
  const sumOfExp = resultArray
    .map((resultItem) => Math.exp(resultItem - largestNumber))
    .reduce((prevNumber, currentNumber) => prevNumber + currentNumber);
  //Normalizes the resultArray by dividing by the sum of all exponentials; this normalization ensures that the sum of the components of the output vector is 1.
  return resultArray.map((resultValue, index) => {
    return Math.exp(resultValue - largestNumber) / sumOfExp;
  });
}

export async function removeBackground(
  image: CanvasImageSource,
  imageWidth: number,
  imageHeight: number,
): Promise<CanvasImageSource> {
  const session = await loadModel();

  const resizedCanvas = resizeImage(image, 320, 320);
  const resizedData = resizedCanvas
    .getContext('2d')!
    .getImageData(0, 0, 320, 320).data;

  // generate input tensor as flattened and normalized array
  const data = new Float32Array(320 * 320 * 3);
  for (let c = 0; c < 3; ++c) {
    for (let x = 0; x < 320; ++x) {
      for (let y = 0; y < 320; ++y) {
        data[c * 320 * 320 + y * 320 + x] =
          resizedData[(y * 320 + x) * 4 + c] / 255;
      }
    }
  }

  const inputTensor = new ort.Tensor('float32', data, [1, 3, 320, 320]);

  // run inference!
  const feeds: ort.InferenceSession.FeedsType = {
    [session.inputNames[0]]: inputTensor,
  };
  const inferenceResult = await session.run(feeds);

  // Get output results with the output name from the model export.
  const output = inferenceResult[session.outputNames[0]];
  // probabilities
  const outputP = output.data as Float32Array;

  // un-flatten the probabilties into an image
  const threshold = 0.3;
  const band = 0.3;
  const lowerBound = threshold - band * 0.5;
  const maskCanvas = new OffscreenCanvas(320, 320);
  const maskCtx = maskCanvas.getContext('2d')!;
  const maskData = maskCtx.createImageData(320, 320);
  for (let i = 0; i < 320 * 320; ++i) {
    maskData.data[i * 4 + 3] =
      Math.max(0, Math.min(1, (outputP[i] - lowerBound) / band)) * 255;
  }
  maskCtx.putImageData(maskData, 0, 0);

  // mask the original image using probabilities
  const outputImage = resizeImage(maskCanvas, imageWidth, imageHeight);
  const outputCtx = outputImage.getContext('2d')!;
  outputCtx.globalCompositeOperation = 'source-in';
  outputCtx.drawImage(image, 0, 0, imageWidth, imageHeight);

  return outputImage;
}
