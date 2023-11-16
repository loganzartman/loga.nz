import fs from 'fs';
import {ImageResponse} from 'next/server';
import {join} from 'path';

const cwd = join(process.cwd(), 'src', 'lib');

function loadFile(relPath: string): Buffer {
  return fs.readFileSync(join(cwd, relPath));
}

function loadDataUrl(relPath: string, mimeType: string): string {
  const fileData = loadFile(relPath);
  const base64Data = fileData.toString('base64');
  return `data:${mimeType};base64,${base64Data}`;
}

/**
 * A heuristic for choosing a font size to fill a box (assuming perfectly even line wrapping)
 * @returns a size in pixels to roughly fill the box
 */
function maximizeFontSize({
  text,
  width,
  height,
}: {
  text: string;
  width: number;
  height: number;
}): number {
  let lines = 1;
  let size = Math.min(width / text.length, height);
  while (size * (lines + 1) < height) {
    lines += 1;
    size = Math.min(width / (text.length / lines), height);
  }
  return size;
}

export async function generateOgImage({
  title,
}: {
  title: string;
}): Promise<ImageResponse> {
  const width = 1200;
  const height = 630;
  const titleFontSize = `${maximizeFontSize({
    text: title,
    width,
    height: height / 2,
  })}px`;

  return new ImageResponse(
    (
      <div style={{display: 'flex'}}>
        <img
          src={loadDataUrl('og-background.png', 'image/png')}
          alt=""
          width={width}
          height={height}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '0%',
            width: '100%',
            height: '50%',
            padding: '2rem',
            paddingBottom: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            color: '#fff2dc',
          }}
        >
          <div
            style={{
              fontFamily: 'font-serif',
              fontSize: titleFontSize,
              // @ts-expect-error
              textWrap: 'balance',
              lineHeight: '1.0',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        {
          name: 'font-serif',
          data: loadFile('DMSerifDisplay-Regular.ttf'),
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );
}
