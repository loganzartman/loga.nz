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

export async function generateOgImage({
  title,
}: {
  title: string;
}): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div style={{display: 'flex'}}>
        <img
          src={loadDataUrl('og-background.png', 'image/png')}
          alt=""
          width={1200}
          height={630}
        />
        <div
          style={{
            position: 'absolute',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            paddingLeft: '2rem',
            paddingBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            color: '#fff2dc',
          }}
        >
          <div
            style={{
              fontFamily: 'font-serif',
              fontSize: '7rem',
              // @ts-expect-error
              textWrap: 'balance',
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
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
