import fs from 'fs';
import {ImageResponse} from 'next/server';
import {join} from 'path';

const cwd = join(process.cwd(), 'src', 'lib');

function loadDataUrl(relPath: string): string {
  // Read the file
  const fileData = fs.readFileSync(join(cwd, relPath));

  // Get MIME type of the file
  const mimeType = 'image/png'; // Example for a PNG image, change as needed

  // Convert to Base64
  const base64Data = fileData.toString('base64');

  // Create and return the Data URL
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
          src={loadDataUrl('og-background.png')}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff2dc',
          }}
        >
          <div
            style={{
              fontFamily: 'font-serif',
              fontSize: '5rem',
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
      // fonts: [
      // {
      //   name: 'font-serif',
      //   data: DMSerif,
      //   weight: 400,
      //   style: 'normal',
      // },
      // ],
    },
  );
}
